// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearResourceCache } from '../../src/ui/lib/resource';
import type { PlatformData } from '../../src/ui/dashboard/lib/event-data';

const h = vi.hoisted(() => ({
  statuses: {} as Record<string, { state: string; info?: { label?: string } }>,
  rp: { connected: false, reconnectSoon: false } as { connected: boolean; label?: string; expiresAt?: string; reconnectSoon: boolean },
  data: {} as Record<string, PlatformData>,
  store: {} as Record<string, unknown>,
}));

vi.mock('../../src/shared/webext', () => ({
  ext: {
    permissions: { contains: () => Promise.resolve(true), request: () => Promise.resolve(true) },
    runtime: { sendMessage: () => Promise.resolve(undefined) },
    storage: {
      local: {
        get: (k: string) => Promise.resolve(k in h.store ? { [k]: h.store[k] } : {}),
        set: (o: Record<string, unknown>) => {
          Object.assign(h.store, o);
          return Promise.resolve();
        },
      },
      onChanged: { addListener: () => undefined, removeListener: () => undefined },
    },
  },
}));
vi.mock('../../src/runtime/sessions', () => ({
  getSessionStatus: (p: string) => Promise.resolve(h.statuses[p] ?? { state: 'no-tab' }),
}));
vi.mock('../../src/adapters/ravepage/auth', () => ({
  status: () => Promise.resolve(h.rp),
  connect: () => Promise.resolve(h.rp),
  disconnect: () => Promise.resolve(),
}));
vi.mock('../../src/ui/dashboard/lib/event-data', () => ({
  loadPlatformData: (p: string) => Promise.resolve(h.data[p] ?? { clubs: [], events: [] }),
}));

import Overview from '../../src/ui/dashboard/views/Overview';

let container: HTMLElement;
let root: Root;

async function render(): Promise<void> {
  await act(async () => {
    root.render(<Overview />);
  });
  for (let i = 0; i < 3; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  }
}

beforeEach(() => {
  clearResourceCache();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  h.statuses = { vrctl: { state: 'logged-out' }, vrcpop: { state: 'logged-in', info: { label: 'Example User' } }, ravepage: { state: 'logged-out' } };
  h.rp = { connected: false, reconnectSoon: false };
  h.store = {}; // rave.page off by default
  h.data = {
    vrcpop: {
      clubs: [{ id: 'grp_a', organizerType: 'group', name: 'Club Pop', vrchatGroupId: 'grp_a', canOrganize: true }],
      events: [
        { platform: 'vrcpop', id: '100001', title: 'up', start: '2027-01-01T20:00:00Z', status: 'upcoming', clubId: 'grp_a', clubName: 'Club Pop' },
        { platform: 'vrcpop', id: '100002', title: 'past', start: '2020-01-01T20:00:00Z', status: 'past', clubId: 'grp_a', clubName: 'Club Pop' },
      ],
    },
  };
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const testid = (id: string): Element | null => container.querySelector(`[data-testid="${id}"]`);

describe('Overview connected-state listings', () => {
  it('shows own clubs, an upcoming count and a View events link for a connected platform', async () => {
    await render();
    expect(testid('platform-detail-vrcpop')).toBeTruthy();
    expect(testid('platform-clubs-vrcpop')?.textContent ?? '').toContain('Club Pop');
    // isUpcoming: future 'upcoming' counts, past 'past' does not -> 1 of 2.
    expect(testid('platform-upcoming-vrcpop')?.textContent ?? '').toContain('1');
    expect(testid('platform-view-events-vrcpop')?.getAttribute('href')).toBe('#/events?platform=vrcpop');
  });

  it('a vrcpop row with a future (owner-tz-parsed) start counts as upcoming (card == #/events)', async () => {
    // parseVrcpopCardDate turns the human label into this ISO; the card must count it.
    h.data = {
      vrcpop: {
        clubs: [{ id: 'grp_a', organizerType: 'group', name: 'Club Pop', vrchatGroupId: 'grp_a', canOrganize: true }],
        events: [{ platform: 'vrcpop', id: '1727', title: "what's poppin", start: '2030-01-05T20:00:00.000Z', status: 'upcoming', clubId: 'grp_a', clubName: 'Club Pop' }],
      },
    };
    await render();
    expect(testid('platform-upcoming-vrcpop')?.textContent ?? '').toContain('1');
  });

  it('renders no rave.page card while the toggle is off', async () => {
    await render();
    expect(testid('platform-detail-vrctl')).toBeNull(); // signed out
    expect(testid('platform-card-ravepage')).toBeNull(); // toggle off
  });
});
