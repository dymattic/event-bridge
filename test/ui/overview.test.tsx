// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Overview pulls in the runtime (webext shim, session status), rave.page auth, and
// settings (the experimental toggle). Mock all so happy-dom can load, and drive
// per-platform state + the toggle from hoisted values.
const h = vi.hoisted(() => ({
  statuses: {} as Record<string, { state: string; info?: { label?: string; expiresAt?: string } }>,
  rp: { connected: false, reconnectSoon: false } as { connected: boolean; label?: string; expiresAt?: string; reconnectSoon: boolean },
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

import Overview from '../../src/ui/dashboard/views/Overview';

async function renderOverview(): Promise<{ container: HTMLElement; cleanup: () => void }> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<Overview />);
  });
  for (let i = 0; i < 3; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  }
  return {
    container,
    cleanup: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

const cardIds = (c: HTMLElement): (string | null)[] =>
  Array.from(c.querySelectorAll('[data-testid^="platform-card-"]')).map((el) => el.getAttribute('data-testid'));
const testid = (c: HTMLElement, id: string) => c.querySelector(`[data-testid="${id}"]`)?.textContent ?? '';

beforeEach(() => {
  h.statuses = {
    vrctl: { state: 'logged-in', info: { label: 'DJ Test' } },
    vrcpop: { state: 'logged-out' },
    ravepage: { state: 'logged-out' },
  };
  h.rp = { connected: true, label: 'Example DJ', expiresAt: '2027-01-15T22:00:00.000Z', reconnectSoon: false };
  h.store = {};
});

describe('Overview: experimental rave.page toggle', () => {
  it('renders exactly TWO cards by default (no rave.page)', async () => {
    const { container, cleanup } = await renderOverview();
    expect(cardIds(container)).toEqual(['platform-card-vrctl', 'platform-card-vrcpop']);
    expect(container.querySelector('[data-testid="platform-card-ravepage"]')).toBeNull();
    // no rave.page copy leaks into the cards region
    expect(container.querySelector('[data-testid="overview-cards"]')?.textContent ?? '').not.toContain('rave.page');
    cleanup();
  });

  it('renders THREE cards when the toggle is on (rave.page last)', async () => {
    h.store = { settings: { experimental: { ravepage: true } } };
    const { container, cleanup } = await renderOverview();
    expect(cardIds(container)).toEqual(['platform-card-vrctl', 'platform-card-vrcpop', 'platform-card-ravepage']);
    cleanup();
  });
});

describe('Overview cards (toggle on)', () => {
  beforeEach(() => {
    h.store = { settings: { experimental: { ravepage: true } } };
  });

  it('shows the mixed-state status wording per platform', async () => {
    const { container, cleanup } = await renderOverview();
    expect(testid(container, 'platform-status-vrctl')).toContain('Signed in (DJ Test)');
    expect(testid(container, 'platform-status-vrcpop')).toContain('Signed out');
    expect(testid(container, 'platform-status-ravepage')).toContain('Connected as Example DJ');
    cleanup();
  });

  it('gives every card identical structure (host, status, supports)', async () => {
    const { container, cleanup } = await renderOverview();
    for (const p of ['vrctl', 'vrcpop', 'ravepage']) {
      expect(container.querySelector(`[data-testid="platform-host-${p}"]`)).toBeTruthy();
      expect(container.querySelector(`[data-testid="platform-status-${p}"]`)).toBeTruthy();
      expect(container.querySelector(`[data-testid="platform-supports-${p}"]`)).toBeTruthy();
    }
    expect(testid(container, 'platform-supports-vrcpop')).toContain('drafts unverified');
    // rave.page card shows the configured instance host(s) as the secondary line.
    expect(testid(container, 'platform-host-ravepage')).toContain('development.rave.page');
    cleanup();
  });

  it('offers Open for tab platforms and Disconnect for a connected rave.page', async () => {
    const { container, cleanup } = await renderOverview();
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttons).toContain('Open vrc.tl');
    expect(buttons).toContain('Open vrcpop.com');
    expect(buttons).toContain('Disconnect');
    cleanup();
  });
});
