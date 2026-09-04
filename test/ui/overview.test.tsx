// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Overview pulls in the runtime (webext shim, session status) + rave.page auth.
// Mock all three so happy-dom (no chrome/browser global) can load, and drive the
// per-platform state from hoisted values.
const h = vi.hoisted(() => ({
  statuses: {} as Record<string, { state: string; info?: { label?: string; expiresAt?: string } }>,
  rp: { connected: false, reconnectSoon: false } as { connected: boolean; label?: string; expiresAt?: string; reconnectSoon: boolean },
}));

vi.mock('../../src/shared/webext', () => ({
  ext: {
    permissions: {
      contains: () => Promise.resolve(true),
      request: () => Promise.resolve(true),
    },
    runtime: { sendMessage: () => Promise.resolve(undefined) },
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
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
  return {
    container,
    cleanup: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

const testid = (c: HTMLElement, id: string) => c.querySelector(`[data-testid="${id}"]`)?.textContent ?? '';

describe('Overview: three equal platform cards', () => {
  beforeEach(() => {
    h.statuses = {
      vrctl: { state: 'logged-in', info: { label: 'DJ Test' } },
      vrcpop: { state: 'logged-out' },
      ravepage: { state: 'logged-out' },
    };
    h.rp = { connected: true, label: 'Example DJ', expiresAt: '2027-01-15T22:00:00.000Z', reconnectSoon: false };
  });

  it('renders exactly three cards in the fixed order vrc.tl, vrcpop, rave.page', async () => {
    const { container, cleanup } = await renderOverview();
    const ids = Array.from(container.querySelectorAll('[data-testid^="platform-card-"]')).map((el) =>
      el.getAttribute('data-testid'),
    );
    expect(ids).toEqual(['platform-card-vrctl', 'platform-card-vrcpop', 'platform-card-ravepage']);
    cleanup();
  });

  it('shows the mixed-state status wording per platform', async () => {
    const { container, cleanup } = await renderOverview();
    expect(testid(container, 'platform-status-vrctl')).toContain('Signed in (DJ Test)');
    expect(testid(container, 'platform-status-vrcpop')).toContain('Signed out');
    expect(testid(container, 'platform-status-ravepage')).toContain('Connected as Example DJ');
    expect(testid(container, 'platform-status-ravepage')).toContain('expires');
    cleanup();
  });

  it('gives every card identical structure (host, status, supports, actions)', async () => {
    const { container, cleanup } = await renderOverview();
    for (const p of ['vrctl', 'vrcpop', 'ravepage']) {
      expect(container.querySelector(`[data-testid="platform-host-${p}"]`)).toBeTruthy();
      expect(container.querySelector(`[data-testid="platform-status-${p}"]`)).toBeTruthy();
      expect(container.querySelector(`[data-testid="platform-supports-${p}"]`)).toBeTruthy();
    }
    // caps-derived Supports line: vrcpop draft is tri-state (unverified).
    expect(testid(container, 'platform-supports-vrctl')).toContain('drafts yes');
    expect(testid(container, 'platform-supports-vrcpop')).toContain('drafts unverified');
    expect(testid(container, 'platform-supports-ravepage')).toContain('drafts yes');
    cleanup();
  });

  it('offers Open for tab platforms and Connect/Disconnect for rave.page', async () => {
    const { container, cleanup } = await renderOverview();
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttons).toContain('Open vrc.tl');
    expect(buttons).toContain('Open vrcpop.com');
    // rave.page is connected in this state -> Disconnect
    expect(buttons).toContain('Disconnect');
    cleanup();
  });
});
