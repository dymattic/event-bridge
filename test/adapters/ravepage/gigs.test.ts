// rave.page listGigs: bookings received for the user's matched performers, plus
// own-events whose lineup names/ids a match. Mocks webext (settings read) + the
// ROUTES chokepoint; no network. appOrigin comes from the configured instance.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFake } from '../../runtime/fake-ext';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

interface Booking {
  event_id?: string;
  event_name?: string;
  event_date?: string;
  slot_starts_at?: string;
  slot_ends_at?: string;
  status?: string;
  is_active?: boolean;
  venue_name?: string;
  requester_name?: string;
}
interface EventPerf {
  performer_id?: string;
  performer?: { name?: string };
  starts_at?: string;
  ends_at?: string;
}

const data = vi.hoisted(() => ({
  myPerfCalls: 0,
  performers: [] as { id?: string; name?: string }[],
  bookings: {} as Record<string, Booking[]>,
  groups: [] as Record<string, unknown>[],
  organizers: [] as Record<string, unknown>[],
  events: [] as Record<string, unknown>[],
  eventPerformers: {} as Record<string, EventPerf[]>,
}));

vi.mock('../../../src/adapters/ravepage/routes', () => ({
  ROUTES: {
    listMyPerformers: () => {
      data.myPerfCalls++;
      return Promise.resolve(data.performers);
    },
    listReceivedBookings: (p: { performerId: string }) => Promise.resolve(data.bookings[p.performerId] ?? []),
    getMyGroups: () => Promise.resolve(data.groups),
    listOrganizers: () => Promise.resolve(data.organizers),
    listEvents: () => Promise.resolve(data.events),
    listPerformers: (p: { eventId: string }) => Promise.resolve(data.eventPerformers[p.eventId] ?? []),
  },
}));

import { listGigs } from '../../../src/adapters/ravepage/adapter';
import { setSettings } from '../../../src/runtime/settings';

const NOW = Date.parse('2026-09-07T00:00:00Z');

beforeEach(() => {
  h.ext = createFake().ext;
  data.myPerfCalls = 0;
  data.performers = [];
  data.bookings = {};
  data.groups = [];
  data.organizers = [];
  data.events = [];
  data.eventPerformers = {};
});

describe('ravepage listGigs', () => {
  it('names empty -> [] and no ROUTES calls', async () => {
    const gigs = await listGigs([], { now: NOW });
    expect(gigs).toEqual([]);
    expect(data.myPerfCalls).toBe(0);
  });

  it('bookings for a matched performer: accepted->confirmed, pending->pending, declined/cancelled dropped', async () => {
    data.performers = [
      { id: 'perf_1', name: 'Example DJ' },
      { id: 'perf_2', name: 'Someone Else' },
    ];
    data.bookings['perf_1'] = [
      { event_id: 'evt_a', event_name: 'Night A', slot_starts_at: '2030-01-01T22:00:00Z', slot_ends_at: '2030-01-02T02:00:00Z', status: 'accepted', is_active: true, venue_name: 'Club A' },
      { event_id: 'evt_b', event_name: 'Night B', slot_starts_at: '2030-02-01T22:00:00Z', slot_ends_at: '2030-02-02T02:00:00Z', status: 'pending', is_active: true, venue_name: 'Club B' },
      { event_id: 'evt_c', event_name: 'Night C', slot_starts_at: '2030-03-01T22:00:00Z', slot_ends_at: '2030-03-02T02:00:00Z', status: 'declined', is_active: true, venue_name: 'Club C' },
      { event_id: 'evt_d', event_name: 'Night D', slot_starts_at: '2030-04-01T22:00:00Z', slot_ends_at: '2030-04-02T02:00:00Z', status: 'cancelled', is_active: true, venue_name: 'Club D' },
    ];

    const gigs = await listGigs(['Example DJ'], { now: NOW });
    const byId = Object.fromEntries(gigs.map((g) => [g.eventId, g]));
    expect(Object.keys(byId).sort()).toEqual(['evt_a', 'evt_b']);
    expect(byId['evt_a']?.status).toBe('confirmed');
    expect(byId['evt_a']?.source).toBe('booking');
    expect(byId['evt_a']?.matchedName).toBe('Example DJ');
    expect(byId['evt_a']?.clubName).toBe('Club A');
    expect(byId['evt_a']?.eventUrl).toBe('https://development.rave.page/events/evt_a');
    expect(byId['evt_a']?.setStart).toBe('2030-01-01T22:00:00Z');
    expect(byId['evt_b']?.status).toBe('pending');
  });

  it('own-event match by performer name and by matched performer id', async () => {
    data.performers = [{ id: 'perf_1', name: 'Example DJ' }];
    data.groups = [{ id: 'grp_1', name: 'My Club', can_organize_events: true }];
    data.events = [
      { id: 'evt_x', title: 'Event X', starts_at: '2030-05-01T20:00:00Z' },
      { id: 'evt_y', title: 'Event Y', starts_at: '2030-06-01T20:00:00Z' },
    ];
    data.eventPerformers['evt_x'] = [{ performer_id: 'perf_9', performer: { name: 'Example DJ' }, starts_at: '2030-05-01T21:00:00Z', ends_at: '2030-05-01T23:00:00Z' }];
    data.eventPerformers['evt_y'] = [{ performer_id: 'perf_1', performer: { name: 'Stage Alias' }, starts_at: '2030-06-01T21:00:00Z', ends_at: '2030-06-01T23:00:00Z' }];

    const gigs = await listGigs(['Example DJ'], { now: NOW });
    const byId = Object.fromEntries(gigs.map((g) => [g.eventId, g]));
    expect(Object.keys(byId).sort()).toEqual(['evt_x', 'evt_y'].sort());
    expect(byId['evt_x']?.source).toBe('own-event');
    expect(byId['evt_x']?.clubName).toBe('My Club');
    expect(byId['evt_x']?.setStart).toBe('2030-05-01T21:00:00Z');
    expect(byId['evt_x']?.matchedName).toBe('Example DJ'); // by name
    expect(byId['evt_y']?.matchedName).toBe('Example DJ'); // by id
  });

  it('dedupe booking vs own-event for the same event -> booking wins', async () => {
    data.performers = [{ id: 'perf_1', name: 'Example DJ' }];
    data.bookings['perf_1'] = [
      { event_id: 'evt_z', event_name: 'Z Night', slot_starts_at: '2030-07-01T22:00:00Z', slot_ends_at: '2030-07-02T02:00:00Z', status: 'accepted', is_active: true, venue_name: 'Venue Z' },
    ];
    data.groups = [{ id: 'grp_1', name: 'My Club', can_organize_events: true }];
    data.events = [{ id: 'evt_z', title: 'Z Night', starts_at: '2030-07-01T20:00:00Z' }];
    data.eventPerformers['evt_z'] = [{ performer_id: 'perf_1', performer: { name: 'Example DJ' }, starts_at: '2030-07-01T21:00:00Z', ends_at: '2030-07-01T23:00:00Z' }];

    const gigs = await listGigs(['Example DJ'], { now: NOW });
    expect(gigs).toHaveLength(1);
    expect(gigs[0]?.eventId).toBe('evt_z');
    expect(gigs[0]?.source).toBe('booking');
    expect(gigs[0]?.clubName).toBe('Venue Z');
  });

  it('eventUrl uses the configured instance appOrigin', async () => {
    await setSettings({ ravepage: { appOrigin: 'https://my.example', apiOrigin: 'https://api.my.example' } });
    data.performers = [{ id: 'perf_1', name: 'Example DJ' }];
    data.bookings['perf_1'] = [
      { event_id: 'evt_a', event_name: 'Night A', slot_starts_at: '2030-01-01T22:00:00Z', slot_ends_at: '2030-01-02T02:00:00Z', status: 'accepted', is_active: true, venue_name: 'Club A' },
    ];
    const gigs = await listGigs(['Example DJ'], { now: NOW });
    expect(gigs[0]?.eventUrl).toBe('https://my.example/events/evt_a');
  });
});
