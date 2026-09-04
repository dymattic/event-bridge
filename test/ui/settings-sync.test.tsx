// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const h = vi.hoisted(() => ({ store: {} as Record<string, unknown> }));
vi.mock('../../src/shared/webext', () => ({
  ext: {
    permissions: { contains: () => Promise.resolve(true), request: () => Promise.resolve(true) },
    storage: {
      local: {
        get: (k: string) => Promise.resolve(k in h.store ? { [k]: h.store[k] } : {}),
        set: (o: Record<string, unknown>) => {
          Object.assign(h.store, o);
          return Promise.resolve();
        },
        remove: (k: string) => {
          delete h.store[k];
          return Promise.resolve();
        },
      },
      onChanged: { addListener: () => undefined, removeListener: () => undefined },
    },
  },
}));
vi.mock('../../src/adapters/ravepage/auth', () => ({
  status: () => Promise.resolve({ connected: false, reconnectSoon: false }),
  connect: () => Promise.resolve({ connected: false, reconnectSoon: false }),
  disconnect: () => Promise.resolve(),
}));

import Settings from '../../src/ui/dashboard/views/Settings';

let container: HTMLElement;
let root: Root;
const q = (id: string): HTMLElement | null => container.querySelector(`[data-testid="${id}"]`);
async function flush(): Promise<void> {
  for (let i = 0; i < 4; i++) await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
}
async function render(): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <NotificationProvider>
          <Settings />
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

beforeEach(() => {
  h.store = {};
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.replaceChildren();
});

describe('Settings sync-defaults card', () => {
  it('renders the mode/source controls and a switch per field', async () => {
    await render();
    expect(q('settings-sync-mode')).toBeTruthy();
    expect(q('settings-sync-source')).toBeTruthy();
    for (const f of ['details', 'lineup', 'poster', 'publishState']) expect(q(`settings-sync-${f}`)).toBeTruthy();
  });

  it('toggling a field switch persists the sync default', async () => {
    await render();
    // publishState defaults off -> toggle it on.
    await click(q('settings-sync-publishState'));
    const stored = h.store.settings as { sync?: { fields?: { publishState?: boolean } } };
    expect(stored?.sync?.fields?.publishState).toBe(true);
  });
});
