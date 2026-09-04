// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The popup pulls in the runtime (webext shim, session status). Mock both so
// happy-dom (no chrome/browser global) can load, and drive the badge state from
// a hoisted per-platform status map.
const h = vi.hoisted(() => ({
  statuses: {} as Record<string, { state: string; info?: { label?: string } }>,
}));

vi.mock('../../src/shared/webext', () => ({
  ext: {
    permissions: {
      contains: () => Promise.resolve(false),
      request: () => Promise.resolve(false),
    },
    runtime: { sendMessage: () => Promise.resolve(undefined) },
  },
}));

vi.mock('../../src/runtime/sessions', () => ({
  getSessionStatus: (p: string) => Promise.resolve(h.statuses[p] ?? { state: 'no-tab' }),
}));

import { App } from '../../src/ui/popup/App';

async function renderPopup(): Promise<{ container: HTMLElement; cleanup: () => void }> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<App />);
  });
  // flush the async session-status promises + their state updates
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

const textOf = (c: HTMLElement, p: string) => c.querySelector(`[data-testid="status-${p}"]`)?.textContent ?? '';

describe('popup App badge per session state', () => {
  beforeEach(() => {
    h.statuses = {};
  });

  it('shows signed-in / signed-out text and rave.page connection state', async () => {
    h.statuses = {
      vrcpop: { state: 'logged-in' },
      vrctl: { state: 'logged-out' },
      ravepage: { state: 'no-tab' },
    };
    const { container, cleanup } = await renderPopup();
    expect(textOf(container, 'vrcpop')).toContain('Signed in');
    expect(textOf(container, 'vrctl')).toContain('Signed out');
    // rave.page derives from the token store, so it speaks "not connected"
    expect(textOf(container, 'ravepage')).toContain('Not connected');
    cleanup();
  });

  it('shows no-access / error text and a Grant access button for no-permission', async () => {
    h.statuses = {
      vrcpop: { state: 'no-permission' },
      vrctl: { state: 'error' },
      ravepage: { state: 'logged-in', info: { label: 'DyMattic' } },
    };
    const { container, cleanup } = await renderPopup();
    expect(textOf(container, 'vrcpop')).toContain('No access');
    expect(textOf(container, 'vrctl')).toContain('Error');
    expect(textOf(container, 'ravepage')).toContain('Connected as');
    // label surfaced from session info
    expect(textOf(container, 'ravepage')).toContain('DyMattic');
    // no-permission row offers the grant gesture
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttons).toContain('Grant access');
    cleanup();
  });

  it('renders the primary actions', async () => {
    const { container, cleanup } = await renderPopup();
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttons).toContain('Open dashboard');
    expect(buttons.some((t) => t === 'Refresh' || t === 'Refreshing…')).toBe(true);
    cleanup();
  });
});
