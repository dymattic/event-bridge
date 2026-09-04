// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import { clearResourceCache } from '../../src/ui/lib/resource';
import type { PlatformData, PlatformConn } from '../../src/ui/dashboard/lib/event-data';

// event-data wraps the adapter registry (webext); mock it so the view renders from
// fake resolved data. webext is mocked (Events imports the runtime + settings).
const h = vi.hoisted(() => ({
  conns: {} as Record<string, PlatformConn>,
  data: {} as Record<string, PlatformData>,
  store: {} as Record<string, unknown>,
}));

vi.mock('../../src/shared/webext', () => ({
  ext: {
    tabs: { create: () => Promise.resolve({}) },
    permissions: { contains: () => Promise.resolve(true), request: () => Promise.resolve(true) },
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

vi.mock('../../src/ui/dashboard/lib/event-data', () => ({
  loadConnections: () => Promise.resolve(h.conns),
  loadPlatformData: (p: string) => Promise.resolve(h.data[p] ?? { clubs: [], events: [] }),
  deletePreview: () => ['Delete event 100001 [vrcpop:delete]'],
  executeDelete: () => Promise.resolve(),
  readEventCore: () => Promise.resolve(undefined),
}));

import Events from '../../src/ui/dashboard/views/Events';

const FUTURE = '2027-01-01T20:00:00Z';
const PAST = '2020-01-01T20:00:00Z';

let container: HTMLElement;
let root: Root;

async function render(query = ''): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <NotificationProvider>
          <Events query={query} />
          <Toast />
        </NotificationProvider>
      </TooltipProvider>,
    );
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
  h.store = { settings: { experimental: { ravepage: true } } }; // three platforms
  h.conns = {
    vrctl: { connected: true },
    vrcpop: { connected: true },
    ravepage: { connected: true },
  };
  h.data = {
    vrctl: {
      clubs: [{ id: '9001', organizerType: 'group', name: 'Club Tl', canOrganize: true }],
      events: [
        { platform: 'vrctl', id: '29778', title: 'just spinnin', start: FUTURE, status: 'promoted', clubId: '9001', clubName: 'Club Tl' },
        { platform: 'vrctl', id: '29779', title: 'old spin', start: PAST, status: 'promoted', clubId: '9001', clubName: 'Club Tl' },
      ],
    },
    vrcpop: {
      clubs: [{ id: 'grp_a', organizerType: 'group', name: 'Club Pop', vrchatGroupId: 'grp_a', canOrganize: true }],
      events: [
        { platform: 'vrcpop', id: '100001', title: "what's poppin", start: FUTURE, status: 'published', clubId: 'grp_a', clubName: 'Club Pop' },
        { platform: 'vrcpop', id: '100002', title: 'draft night', start: FUTURE, status: 'draft', clubId: 'grp_a', clubName: 'Club Pop' },
      ],
    },
    ravepage: {
      clubs: [{ id: 'grp_b', organizerType: 'group', name: 'Club Rave', canOrganize: true }],
      events: [
        { platform: 'ravepage', id: 'evt_1', title: 'rave night', start: FUTURE, status: 'published', clubId: 'grp_b', clubName: 'Club Rave' },
        { platform: 'ravepage', id: 'evt_2', title: 'chill set', start: FUTURE, status: 'draft', clubId: 'grp_b', clubName: 'Club Rave' },
      ],
    },
  };
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const RAW_ID = /^(grp_|evt_|usr_)|^user \d+$/;

describe('Events view (rave.page toggle on)', () => {
  it('shows resolved titles + club names for all three platforms', async () => {
    await render();
    const text = container.textContent ?? '';
    expect(text).toContain('just spinnin');
    expect(text).toContain("what's poppin");
    expect(text).toContain('rave night');
    expect(text).toContain('Club Tl');
    expect(text).toContain('Club Pop');
    expect(text).toContain('Club Rave');
  });

  it('never renders a raw id as a table cell label', async () => {
    await render();
    const cells = Array.from(container.querySelectorAll('td'));
    for (const td of cells) {
      const t = (td.textContent ?? '').trim();
      expect(RAW_ID.test(t), `raw id leaked in a cell: "${t}"`).toBe(false);
    }
  });

  it('default upcoming filter hides a past event', async () => {
    await render();
    expect(container.textContent ?? '').not.toContain('old spin');
  });

  it('URL platform filter narrows to one platform', async () => {
    await render('platform=vrcpop');
    const text = container.textContent ?? '';
    expect(text).toContain("what's poppin");
    expect(text).not.toContain('rave night');
    expect(text).not.toContain('just spinnin');
  });

  it('renders the disabled "New event" affordance (P6.2)', async () => {
    await render();
    const newBtn = container.querySelector('[data-testid="events-new"]') as HTMLButtonElement | null;
    expect(newBtn).toBeTruthy();
    expect(newBtn?.disabled).toBe(true);
  });
});

describe('Events view (rave.page toggle off = default)', () => {
  beforeEach(() => {
    h.store = {}; // rave.page off
  });

  it('shows only vrc.tl + vrcpop events, never rave.page', async () => {
    await render();
    const text = container.textContent ?? '';
    expect(text).toContain('just spinnin');
    expect(text).toContain("what's poppin");
    expect(text).not.toContain('rave night'); // gated out
  });

  it('empty-state connect list offers only the two enabled platforms', async () => {
    h.conns = { vrctl: { connected: false }, vrcpop: { connected: false }, ravepage: { connected: false } };
    await render();
    expect(container.querySelector('[data-testid="events-none-connected"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="events-connect-ravepage"]')).toBeNull();
    expect(container.querySelector('[data-testid="events-connect-vrctl"]')).toBeTruthy();
  });
});
