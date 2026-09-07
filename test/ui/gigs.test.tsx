// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import { clearResourceCache } from '../../src/ui/lib/resource';
import type { Gig } from '../../src/core/gigs';
import type { IsoUtc } from '../../src/core/schema';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// Fake storage.local that fires storage.onChanged (so onSettingsChange updates the
// view). `state` is reset per test; the ext closures read it live.
const h = vi.hoisted(() => {
  const state = { store: {} as Record<string, unknown>, listeners: new Set<(c: unknown, a: string) => void>() };
  const ext = {
    storage: {
      local: {
        get: (k: string) => Promise.resolve(k in state.store ? { [k]: state.store[k] } : {}),
        set: (o: Record<string, unknown>) => {
          for (const [k, v] of Object.entries(o)) {
            const oldValue = state.store[k];
            state.store[k] = v;
            state.listeners.forEach((l) => l({ [k]: { newValue: v, oldValue } }, 'local'));
          }
          return Promise.resolve();
        },
      },
      onChanged: {
        addListener: (cb: (c: unknown, a: string) => void) => state.listeners.add(cb),
        removeListener: (cb: (c: unknown, a: string) => void) => state.listeners.delete(cb),
      },
    },
  };
  return { state, ext };
});
vi.mock('../../src/shared/webext', () => ({ ext: h.ext }));

const data = vi.hoisted(() => ({ loadConnections: vi.fn(), loadGigs: vi.fn() }));
vi.mock('../../src/ui/dashboard/lib/event-data', () => ({
  loadConnections: data.loadConnections,
  loadGigs: data.loadGigs,
}));

const dl = vi.hoisted(() => ({ downloadText: vi.fn() }));
vi.mock('../../src/ui/dashboard/lib/download', () => ({ downloadText: dl.downloadText }));

const tabs = vi.hoisted(() => ({ ensureAgent: vi.fn() }));
vi.mock('../../src/runtime/tabs', () => ({ ensureAgent: tabs.ensureAgent }));

import Gigs from '../../src/ui/dashboard/views/Gigs';

// Two platforms on the SAME event within 1h (group into one row, two chips) + a
// pending rave.page booking (its own row, "pending").
const GIGS: Gig[] = [
  {
    platform: 'vrctl', eventId: '55501', title: 'Example Night', eventUrl: 'https://vrc.tl/event/55501',
    clubName: 'Example Club', start: '2030-09-08T03:00:00Z' as IsoUtc, setStart: '2030-09-08T03:00:00Z' as IsoUtc,
    setEnd: '2030-09-08T04:00:00Z' as IsoUtc, matchedName: 'Example DJ', status: 'confirmed', source: 'own-event',
  },
  {
    platform: 'vrcpop', eventId: '100777', title: 'Example Night', eventUrl: 'https://vrcpop.com/event/100777',
    clubName: 'Example Club', start: '2030-09-08T03:30:00Z' as IsoUtc, setStart: '2030-09-08T03:30:00Z' as IsoUtc,
    matchedName: 'Example DJ', status: 'confirmed', source: 'profile',
  },
  {
    platform: 'ravepage', eventId: '990088', title: 'Pending Booking Night', eventUrl: 'https://development.rave.page/events/990088',
    clubName: 'Some Venue', start: '2030-10-01T20:00:00Z' as IsoUtc, matchedName: 'Example DJ', status: 'pending', source: 'booking',
  },
];

const CONNS = { vrctl: { connected: true }, vrcpop: { connected: true }, ravepage: { connected: false } };

let container: HTMLElement;
let root: Root;
const q = (id: string): HTMLElement | null => container.querySelector(`[data-testid="${id}"]`);

async function flush(): Promise<void> {
  for (let i = 0; i < 5; i++) await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
}
async function render(): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <NotificationProvider>
          <Gigs />
          <Toast />
        </NotificationProvider>
      </TooltipProvider>,
    );
  });
  await flush();
}
async function click(el: Element | null): Promise<void> {
  await act(async () => { (el as HTMLElement | null)?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await flush();
}
function setInput(el: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

beforeEach(() => {
  clearResourceCache();
  h.state.store = {};
  h.state.listeners.clear();
  data.loadConnections.mockReset().mockResolvedValue(CONNS);
  data.loadGigs.mockReset().mockResolvedValue({ gigs: GIGS, errors: {}, queried: ['vrctl', 'vrcpop'] });
  dl.downloadText.mockReset();
  tabs.ensureAgent.mockReset().mockResolvedValue({ tabId: 1, opened: true });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.replaceChildren();
});

describe('Gigs view', () => {
  it('(a) shows the empty-names state and does NOT query gigs with no names', async () => {
    await render();
    expect(q('gigs-empty-names')).toBeTruthy();
    expect(data.loadGigs).not.toHaveBeenCalled();
  });

  it('(b) adds a name via input+Enter: persisted + loader called once with (queried, names)', async () => {
    await render();
    const input = q('gigs-name-input') as HTMLInputElement;
    await act(async () => { setInput(input, 'Example DJ'); });
    await flush();
    await act(async () => { input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); });
    await flush();

    expect((h.state.store.settings as { gigs: { names: string[] } }).gigs.names).toEqual(['Example DJ']);
    expect(data.loadGigs).toHaveBeenCalledTimes(1);
    expect(data.loadGigs).toHaveBeenCalledWith(['vrctl', 'vrcpop'], ['Example DJ']);
  });

  it('(c) renders human labels (title, club, platform names) and no raw event ids', async () => {
    h.state.store = { settings: { gigs: { names: ['Example DJ'] } } };
    await render();
    expect(q('gigs-table')).toBeTruthy();
    const text = container.textContent ?? '';
    expect(text).toContain('Example Night');
    expect(text).toContain('Example Club');
    expect(text).toContain('vrc.tl');
    expect(text).toContain('vrcpop.com');
    // ids ride in hrefs only, never as a primary label
    expect(text).not.toContain('100777');
    expect(text).not.toContain('55501');
    expect(text).not.toContain('990088');
    // grouped: two platforms on the one event -> two chips in the group row
    expect(container.querySelectorAll('[data-testid="gigs-link-vrctl"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-testid="gigs-link-vrcpop"]').length).toBeGreaterThan(0);
  });

  it('(d) does NOT auto-refresh on a timer (count unchanged after 15 min)', async () => {
    h.state.store = { settings: { gigs: { names: ['Example DJ'] } } };
    await render();
    expect(data.loadGigs).toHaveBeenCalledTimes(1);
    vi.useFakeTimers();
    vi.advanceTimersByTime(15 * 60_000);
    vi.useRealTimers();
    expect(data.loadGigs).toHaveBeenCalledTimes(1);
  });

  it('(e) Refresh re-fetches', async () => {
    h.state.store = { settings: { gigs: { names: ['Example DJ'] } } };
    await render();
    expect(data.loadGigs).toHaveBeenCalledTimes(1);
    await click(q('gigs-refresh'));
    expect(data.loadGigs).toHaveBeenCalledTimes(2);
  });

  it('(f) Export .ics writes an ICS calendar via downloadText', async () => {
    h.state.store = { settings: { gigs: { names: ['Example DJ'] } } };
    await render();
    await click(q('gigs-export'));
    expect(dl.downloadText).toHaveBeenCalledWith(
      'event-bridge-gigs.ics',
      'text/calendar;charset=utf-8',
      expect.stringContaining('BEGIN:VCALENDAR'),
    );
  });

  it('(g) a platform error shows its hint while the rows that loaded still render', async () => {
    data.loadGigs.mockResolvedValue({ gigs: GIGS, errors: { vrcpop: 'vrcpop asked us to slow down.' }, queried: ['vrctl', 'vrcpop'] });
    h.state.store = { settings: { gigs: { names: ['Example DJ'] } } };
    await render();
    expect(q('gigs-table')).toBeTruthy();
    expect(container.textContent).toContain('Example Night');
    const err = q('gigs-error-vrcpop');
    expect(err).toBeTruthy();
    expect(err?.textContent).toContain('vrcpop.com: vrcpop asked us to slow down.');
  });

  // vrc.tl no tab open, vrcpop connected: sources line shows WHY vrc.tl was
  // skipped + an Open button, and only vrcpop is queried.
  const VRCTL_NO_TAB = {
    vrctl: { connected: false, state: 'no-tab' },
    vrcpop: { connected: true, state: 'logged-in' },
    ravepage: { connected: false },
  };

  it('(h) sources line: unchecked platform shows its reason + Open button; only connected platform queried', async () => {
    data.loadConnections.mockResolvedValue(VRCTL_NO_TAB);
    h.state.store = { settings: { gigs: { names: ['Example DJ'] } } };
    await render();
    expect(q('gigs-sources')).toBeTruthy();
    expect(q('gigs-source-vrctl')?.textContent).toContain('No tab open');
    expect(q('gigs-open-vrctl')).toBeTruthy();
    expect(q('gigs-source-vrcpop')?.textContent).toContain('checked');
    expect(data.loadGigs).toHaveBeenCalledTimes(1);
    expect(data.loadGigs).toHaveBeenCalledWith(['vrcpop'], ['Example DJ']);
  });

  it('(i) Open button calls ensureAgent (no focus steal) and re-queries once connected — no manual Refresh', async () => {
    data.loadConnections.mockResolvedValue(VRCTL_NO_TAB);
    h.state.store = { settings: { gigs: { names: ['Example DJ'] } } };
    await render();
    expect(data.loadGigs).toHaveBeenCalledWith(['vrcpop'], ['Example DJ']);

    // Session flips to connected after the tab opens.
    data.loadConnections.mockResolvedValue({
      vrctl: { connected: true, state: 'logged-in' },
      vrcpop: { connected: true, state: 'logged-in' },
      ravepage: { connected: false },
    });
    await click(q('gigs-open-vrctl'));
    await flush();

    expect(tabs.ensureAgent).toHaveBeenCalledWith('vrctl', { allowOpen: true, active: false });
    expect(data.loadGigs).toHaveBeenCalledWith(['vrctl', 'vrcpop'], ['Example DJ']);
  });

  it('(j) empty state lists the unchecked platform + reason', async () => {
    data.loadConnections.mockResolvedValue(VRCTL_NO_TAB);
    data.loadGigs.mockResolvedValue({ gigs: [], errors: {}, queried: ['vrcpop'] });
    h.state.store = { settings: { gigs: { names: ['Example DJ'] } } };
    await render();
    expect(q('gigs-empty')).toBeTruthy();
    expect(q('gigs-empty')?.textContent).toContain('Not checked: vrc.tl (No tab open)');
  });

  it('(k) footer copy mentions the vrc.tl public timeline', async () => {
    h.state.store = { settings: { gigs: { names: ['Example DJ'] } } };
    await render();
    expect(container.textContent).toContain('public timeline');
  });
});
