// @vitest-environment happy-dom
// vrc.tl listGigs: scan the admin grid, read upcoming detail forms, keep events
// whose lineup names a matching performer. Fake `send` serves the sanitized grid
// + detail fixtures and records every request.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { HttpRequest, HttpResult } from '../../../src/shared/agent-protocol';
import { listGigs, MAX_EVENT_READS, MAX_TIMELINE_PAGES } from '../../../src/adapters/vrctl/adapter';

const FIX = join(process.cwd(), 'test', 'fixtures', 'vrctl');
const GRID = readFileSync(join(FIX, 'admin-grid.html'), 'utf8');
const DETAIL = readFileSync(join(FIX, 'detail-form.html'), 'utf8');
const TL1 = readFileSync(join(FIX, 'timeline-page.json'), 'utf8');
const TL2 = readFileSync(join(FIX, 'timeline-page-2.json'), 'utf8');
const EMPTY_TL = JSON.stringify({ lastUpdates: [], eventData: { events: [], organizers: [], performers: [] } });
const noPace = async (): Promise<void> => undefined;

const okr = (path: string, body: string): HttpResult => ({ status: 200, finalUrl: `https://vrc.tl${path}`, headers: {}, body });

// Own-surface-only mock: empty public timeline so the timeline pass is a single
// no-op request. Used by the own-club scan tests below (they assert grid/detail
// counts, unaffected by the extra timeline call).
function mockSend(): { send: (r: HttpRequest) => Promise<HttpResult>; calls: HttpRequest[] } {
  const calls: HttpRequest[] = [];
  const send = async (req: HttpRequest): Promise<HttpResult> => {
    calls.push(req);
    if (req.path.startsWith('/api/v1/events')) return okr(req.path, EMPTY_TL);
    if (req.method === 'GET' && req.path.startsWith('/admin/event/detail/')) return okr(req.path, DETAIL);
    if (req.method === 'GET' && req.path === '/admin/event') return okr('/admin/event', GRID);
    return okr(req.path, '');
  };
  return { send, calls };
}

const detailReads = (calls: HttpRequest[]): HttpRequest[] => calls.filter((c) => c.path.startsWith('/admin/event/detail/'));
const gridReads = (calls: HttpRequest[]): HttpRequest[] => calls.filter((c) => c.path === '/admin/event');
const tlReads = (calls: HttpRequest[]): HttpRequest[] => calls.filter((c) => c.path.startsWith('/api/v1/events'));

// A timeline page with the given lastUpdates days and events (empty tables by
// default) — drives the paging loop in the sequence/cap/empty tests.
function tlPage(days: string[], events: unknown[] = []): string {
  return JSON.stringify({ lastUpdates: days.map((day) => ({ day, instant: 0 })), eventData: { events, organizers: [], performers: [] } });
}

describe('vrctl listGigs', () => {
  it('names empty -> [] with no requests', async () => {
    const { send, calls } = mockSend();
    const gigs = await listGigs(send, [], { now: Date.parse('2026-09-02T12:00:00Z'), pace: noPace });
    expect(gigs).toEqual([]);
    expect(calls).toHaveLength(0);
  });

  it('matches by slot performer name; past grid rows are skipped (no detail read)', async () => {
    const { send, calls } = mockSend();
    // 2026-09-02: only the 2030 row is upcoming; the two 2026-08/09 rows are past.
    const gigs = await listGigs(send, ['Example DJ'], { now: Date.parse('2026-09-02T12:00:00Z'), pace: noPace });

    expect(gridReads(calls)).toHaveLength(1);
    expect(detailReads(calls)).toHaveLength(1); // only the upcoming row was read
    expect(detailReads(calls)[0]?.path).toBe('/admin/event/detail/100002');

    expect(gigs).toHaveLength(1);
    const g = gigs[0]!;
    expect(g.eventId).toBe('100002');
    expect(g.title).toBe("what's poppin");
    expect(g.eventUrl).toBe('https://vrc.tl/event/100002');
    expect(g.clubName).toBe('Example Club');
    expect(g.matchedName).toBe('Example DJ');
    expect(g.source).toBe('own-event');
    expect(g.status).toBe('confirmed');
  });

  it('non-matching name -> no gigs (all upcoming rows read, none kept)', async () => {
    const { send, calls } = mockSend();
    const gigs = await listGigs(send, ['Nobody At All'], { now: 0, pace: noPace });
    expect(gigs).toEqual([]);
    expect(detailReads(calls).length).toBeGreaterThan(0);
  });

  it('caps detail reads at maxEventReads', async () => {
    const { send, calls } = mockSend();
    // now=0 -> all three grid rows count as upcoming; cap to 2 reads.
    const gigs = await listGigs(send, ['Example DJ'], { now: 0, pace: noPace, maxEventReads: 2 });
    expect(detailReads(calls)).toHaveLength(2);
    expect(gigs).toHaveLength(2);
    expect(MAX_EVENT_READS).toBe(25);
  });
});

describe('vrctl listGigs — public timeline source', () => {
  // Serves the fixture pages (page-1 bare, page-2 for the page-1 last-day after)
  // + the own-club grid/detail fixtures.
  function mockFixtures(): { send: (r: HttpRequest) => Promise<HttpResult>; calls: HttpRequest[] } {
    const calls: HttpRequest[] = [];
    const send = async (req: HttpRequest): Promise<HttpResult> => {
      calls.push(req);
      if (req.path === '/api/v1/events') return okr(req.path, TL1);
      if (req.path === '/api/v1/events?after=2030-06-16') return okr(req.path, TL2);
      if (req.path.startsWith('/api/v1/events')) return okr(req.path, EMPTY_TL);
      if (req.method === 'GET' && req.path.startsWith('/admin/event/detail/')) return okr(req.path, DETAIL);
      if (req.method === 'GET' && req.path === '/admin/event') return okr('/admin/event', GRID);
      return okr(req.path, '');
    };
    return { send, calls };
  }

  it('matches a slot performer at a club the user does NOT manage (source profile); past + hidden-slot events skipped', async () => {
    const { send, calls } = mockFixtures();
    // now=2030-03-01: page-1 max day (2030-06-16) already covers now+30 -> one page.
    // own-club grid rows are all past at this now -> no detail reads.
    const gigs = await listGigs(send, ['Example DJ'], { now: Date.parse('2030-03-01T00:00:00Z'), pace: noPace });

    expect(tlReads(calls)).toHaveLength(1);
    expect(gridReads(calls)).toHaveLength(1);
    expect(detailReads(calls)).toHaveLength(0);

    expect(gigs).toHaveLength(1);
    const g = gigs[0]!;
    expect(g.eventId).toBe('300001');
    expect(g.title).toBe('Timeline Night');
    expect(g.clubName).toBe('Other Club'); // a club the user does not manage
    expect(g.eventUrl).toBe('https://vrc.tl/event/300001');
    expect(g.setStart).toBe('2030-06-15T22:00:00Z');
    expect(g.matchedName).toBe('Example DJ');
    expect(g.source).toBe('profile');
    expect(g.status).toBe('confirmed');
  });

  it('pages across timeline pages and matches a hidden performer', async () => {
    const { send, calls } = mockFixtures();
    // now=2030-06-14, horizon 4 days -> page-1 (max 2030-06-16) doesn't cover it,
    // page-2 (max 2030-06-19) does. 'Other DJ' is a hidden performer on page-2.
    const gigs = await listGigs(send, ['Other DJ'], { now: Date.parse('2030-06-14T00:00:00Z'), pace: noPace, timelineDays: 4 });

    const tlPaths = tlReads(calls).map((c) => c.path);
    expect(tlPaths).toEqual(['/api/v1/events', '/api/v1/events?after=2030-06-16']);

    expect(gigs).toHaveLength(1);
    const g = gigs[0]!;
    expect(g.eventId).toBe('300004');
    expect(g.matchedName).toBe('Other DJ');
    expect(g.clubName).toBe('Example Club');
    expect(g.source).toBe('profile');
  });

  it('empty names -> no requests at all (neither source)', async () => {
    const { send, calls } = mockFixtures();
    const gigs = await listGigs(send, [], { now: Date.parse('2030-06-14T00:00:00Z'), pace: noPace });
    expect(gigs).toEqual([]);
    expect(calls).toHaveLength(0);
  });

  it('request order: all timeline pages, THEN the grid, THEN detail reads; stops when now+timelineDays is covered', async () => {
    const calls: HttpRequest[] = [];
    const send = async (req: HttpRequest): Promise<HttpResult> => {
      calls.push(req);
      if (req.path === '/api/v1/events') return okr(req.path, tlPage(['2029-12-31', '2030-01-01', '2030-01-02']));
      if (req.path === '/api/v1/events?after=2030-01-02') return okr(req.path, tlPage(['2030-01-03', '2030-01-04', '2030-01-05']));
      if (req.path === '/api/v1/events?after=2030-01-05') return okr(req.path, tlPage(['2030-01-06', '2030-01-07', '2030-01-08']));
      if (req.path.startsWith('/api/v1/events')) return okr(req.path, EMPTY_TL);
      if (req.method === 'GET' && req.path.startsWith('/admin/event/detail/')) return okr(req.path, DETAIL);
      if (req.method === 'GET' && req.path === '/admin/event') return okr('/admin/event', GRID);
      return okr(req.path, '');
    };
    // now=2030-01-01, horizon 5 days -> covered once a page's newest day >= 2030-01-06.
    await listGigs(send, ['Example DJ'], { now: Date.parse('2030-01-01T00:00:00Z'), pace: noPace, timelineDays: 5 });

    expect(tlReads(calls).map((c) => c.path)).toEqual([
      '/api/v1/events',
      '/api/v1/events?after=2030-01-02',
      '/api/v1/events?after=2030-01-05',
    ]);
    const lastTl = calls.map((c) => c.path).reduce((acc, p, i) => (p.startsWith('/api/v1/events') ? i : acc), -1);
    const firstGrid = calls.findIndex((c) => c.path === '/admin/event');
    const firstDetail = calls.findIndex((c) => c.path.startsWith('/admin/event/detail/'));
    expect(lastTl).toBeLessThan(firstGrid); // timeline pass fully precedes own-club scan
    expect(firstGrid).toBeLessThan(firstDetail); // grid before detail reads
  });

  it('stops at MAX_TIMELINE_PAGES when the horizon is never covered', async () => {
    const calls: HttpRequest[] = [];
    const send = async (req: HttpRequest): Promise<HttpResult> => {
      calls.push(req);
      if (req.path.startsWith('/api/v1/events')) return okr(req.path, tlPage(['2030-01-01'])); // never advances past horizon
      if (req.method === 'GET' && req.path.startsWith('/admin/event/detail/')) return okr(req.path, DETAIL);
      if (req.method === 'GET' && req.path === '/admin/event') return okr('/admin/event', GRID);
      return okr(req.path, '');
    };
    await listGigs(send, ['Example DJ'], { now: Date.parse('2030-01-01T00:00:00Z'), pace: noPace });
    expect(tlReads(calls)).toHaveLength(MAX_TIMELINE_PAGES);
    expect(MAX_TIMELINE_PAGES).toBe(12);
  });

  it('stops on an empty page', async () => {
    const calls: HttpRequest[] = [];
    const send = async (req: HttpRequest): Promise<HttpResult> => {
      calls.push(req);
      if (req.path === '/api/v1/events') return okr(req.path, tlPage(['2030-06-01', '2030-06-02', '2030-06-03']));
      if (req.path.startsWith('/api/v1/events')) return okr(req.path, tlPage([])); // empty -> stop
      if (req.method === 'GET' && req.path.startsWith('/admin/event/detail/')) return okr(req.path, DETAIL);
      if (req.method === 'GET' && req.path === '/admin/event') return okr('/admin/event', GRID);
      return okr(req.path, '');
    };
    await listGigs(send, ['Example DJ'], { now: Date.parse('2030-06-01T00:00:00Z'), pace: noPace });
    expect(tlReads(calls)).toHaveLength(2);
  });

  it('dedupes a timeline entry against the own-club scan (timeline wins over own-event)', async () => {
    const calls: HttpRequest[] = [];
    // Timeline lists event 100002 (also an own-club grid row) with a matching slot.
    const tlEvent = {
      id: 100002,
      name: 'Timeline WP',
      description: null,
      category: 1,
      tags: [],
      organizers: [9002],
      hostOrganizer: 9002,
      start: Math.floor(Date.parse('2030-01-05T22:00:00Z') / 1000),
      end: Math.floor(Date.parse('2030-01-06T00:00:00Z') / 1000),
      duration: 7200,
      urls: {},
      poster: null,
      isHighlighted: false,
      extensions: { performerSlots: true },
      promoted: true,
      showSlots: true,
      eventSlots: [{ id: 1, start: Math.floor(Date.parse('2030-01-05T22:00:00Z') / 1000), duration: 3600, performers: [{ id: 1, order: 0, performerId: 5001 }], order: 0, flag: 'performers', note: null }],
    };
    const body = JSON.stringify({
      lastUpdates: [{ day: '2030-01-05', instant: 0 }],
      eventData: { events: [tlEvent], organizers: [{ id: 9002, name: 'Other Club' }], performers: [{ id: 5001, hidden: false, name: 'Example DJ' }] },
    });
    const send = async (req: HttpRequest): Promise<HttpResult> => {
      calls.push(req);
      if (req.path.startsWith('/api/v1/events')) return okr(req.path, body);
      if (req.method === 'GET' && req.path.startsWith('/admin/event/detail/')) return okr(req.path, DETAIL);
      if (req.method === 'GET' && req.path === '/admin/event') return okr('/admin/event', GRID);
      return okr(req.path, '');
    };
    // now=2026-09-02: own-club grid row 100002 (2030-01-05) is upcoming -> own-event
    // gig; timeline also yields 100002 (source 'profile'), which wins the dedupe.
    const gigs = await listGigs(send, ['Example DJ'], { now: Date.parse('2026-09-02T12:00:00Z'), pace: noPace });

    expect(tlReads(calls)).toHaveLength(1); // 2030 day covers now+30 -> one page
    expect(gigs).toHaveLength(1);
    const g = gigs[0]!;
    expect(g.eventId).toBe('100002');
    expect(g.source).toBe('profile'); // timeline outranks own-event
    expect(g.title).toBe('Timeline WP');
  });
});
