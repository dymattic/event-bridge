// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The popup pulls in the runtime (webext shim, session status) + settings (the
// experimental toggle decides which rows show). Mock both; drive from hoisted state.
const h = vi.hoisted(() => ({
  statuses: {} as Record<string, { state: string; info?: { label?: string } }>,
  store: {} as Record<string, unknown>,
}));

vi.mock('../../src/shared/webext', () => ({
  ext: {
    permissions: { contains: () => Promise.resolve(false), request: () => Promise.resolve(false) },
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

import { App } from '../../src/ui/popup/App';

async function renderPopup(): Promise<{ container: HTMLElement; cleanup: () => void }> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<App />);
  });
  for (let i = 0; i < 4; i++) {
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

const textOf = (c: HTMLElement, p: string) => c.querySelector(`[data-testid="status-${p}"]`)?.textContent ?? '';

describe('popup App', () => {
  beforeEach(() => {
    h.statuses = {};
    h.store = {};
  });

  it('shows only two platform rows by default (rave.page off)', async () => {
    h.statuses = { vrcpop: { state: 'logged-in' }, vrctl: { state: 'logged-out' } };
    const { container, cleanup } = await renderPopup();
    expect(textOf(container, 'vrcpop')).toContain('Signed in');
    expect(textOf(container, 'vrctl')).toContain('Signed out');
    expect(container.querySelector('[data-testid="status-ravepage"]')).toBeNull();
    cleanup();
  });

  it('shows the rave.page row when the toggle is on', async () => {
    h.store = { settings: { experimental: { ravepage: true } } };
    h.statuses = {
      vrcpop: { state: 'logged-in' },
      vrctl: { state: 'logged-out' },
      ravepage: { state: 'logged-in', info: { label: 'DyMattic' } },
    };
    const { container, cleanup } = await renderPopup();
    expect(textOf(container, 'ravepage')).toContain('Connected as');
    expect(textOf(container, 'ravepage')).toContain('DyMattic');
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
