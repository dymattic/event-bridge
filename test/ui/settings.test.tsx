// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';

// This spec drives clicks/typing (state updates outside render) — opt into act().
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const h = vi.hoisted(() => ({
  store: {} as Record<string, unknown>,
  grantResult: true,
  requestCalls: [] as { origins?: string[] }[],
  conn: { connected: false, reconnectSoon: false } as { connected: boolean; reconnectSoon: boolean; label?: string },
}));

vi.mock('../../src/shared/webext', () => ({
  ext: {
    permissions: {
      contains: () => Promise.resolve(true),
      request: (arg: { origins?: string[] }) => {
        h.requestCalls.push(arg);
        return Promise.resolve(h.grantResult);
      },
    },
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
  status: () => Promise.resolve(h.conn),
  connect: () => Promise.resolve(h.conn),
  disconnect: () => Promise.resolve(),
}));

import Settings from '../../src/ui/dashboard/views/Settings';
import { RAVEPAGE_DEFAULT_INSTANCE } from '../../src/runtime/settings';

let container: HTMLElement;
let root: Root;

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
async function flush(): Promise<void> {
  for (let i = 0; i < 3; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  }
}
function id<T extends HTMLElement = HTMLElement>(testid: string): T | null {
  return container.querySelector(`[data-testid="${testid}"]`);
}
function setInput(el: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}
async function click(el: HTMLElement): Promise<void> {
  await act(async () => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await flush();
}
async function type(testid: string, value: string): Promise<void> {
  await act(async () => {
    setInput(id<HTMLInputElement>(testid)!, value);
  });
  await flush();
}

const storedInstance = (): { appOrigin?: string; apiOrigin?: string } => {
  const s = h.store.settings as { ravepage?: { appOrigin?: string; apiOrigin?: string } } | undefined;
  return s?.ravepage ?? {};
};

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  h.store = {};
  h.grantResult = true;
  h.requestCalls = [];
  h.conn = { connected: false, reconnectSoon: false };
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('Settings view', () => {
  it('renders the view; instance card hidden while the toggle is off', async () => {
    await render();
    expect(id('settings-view')).toBeTruthy();
    expect(id('settings-ravepage-toggle')).toBeTruthy();
    expect(id('settings-ravepage-instance')).toBeNull();
    expect(id('settings-ravepage-app-origin')).toBeNull();
  });

  it('Editor card shows the default event length', async () => {
    await render();
    expect(id<HTMLInputElement>('settings-editor-duration')?.value).toBe('120');
  });

  it('Editor card reflects a stored event length', async () => {
    h.store = { settings: { editor: { defaultDurationMin: 45 } } };
    await render();
    expect(id<HTMLInputElement>('settings-editor-duration')?.value).toBe('45');
  });

  it('shows the instance card with default origins when the toggle is on', async () => {
    h.store = { settings: { experimental: { ravepage: true } } };
    await render();
    expect(id('settings-ravepage-instance')).toBeTruthy();
    expect(id<HTMLInputElement>('settings-ravepage-app-origin')?.value).toBe(RAVEPAGE_DEFAULT_INSTANCE.appOrigin);
    expect(id<HTMLInputElement>('settings-ravepage-api-origin')?.value).toBe(RAVEPAGE_DEFAULT_INSTANCE.apiOrigin);
    expect(id('settings-ravepage-status')?.textContent).toContain('Not connected');
  });

  it('invalid origin -> settings-error, no permission request', async () => {
    h.store = { settings: { experimental: { ravepage: true } } };
    await render();
    await type('settings-ravepage-app-origin', 'not a url');
    await click(id('settings-ravepage-save')!);
    expect(id('settings-error')?.textContent).toContain('App origin');
    expect(h.requestCalls).toHaveLength(0);
  });

  it('Save requests both patterns and persists ONLY on grant', async () => {
    h.store = { settings: { experimental: { ravepage: true } } };
    await render();
    await type('settings-ravepage-app-origin', 'https://app.custom.example');
    await type('settings-ravepage-api-origin', 'https://api.custom.example');

    // denial: request called, nothing persisted (custom origin NOT written)
    h.grantResult = false;
    await click(id('settings-ravepage-save')!);
    expect(h.requestCalls.at(-1)?.origins).toEqual(['https://app.custom.example/*', 'https://api.custom.example/*']);
    expect(storedInstance().appOrigin).not.toBe('https://app.custom.example');
    expect(id('settings-error')?.textContent).toContain('denied');

    // grant: persisted
    h.grantResult = true;
    await click(id('settings-ravepage-save')!);
    expect(storedInstance()).toEqual({ appOrigin: 'https://app.custom.example', apiOrigin: 'https://api.custom.example' });
  });

  it('Reset restores default origins', async () => {
    h.store = { settings: { experimental: { ravepage: true }, ravepage: { appOrigin: 'https://app.custom.example', apiOrigin: 'https://api.custom.example' } } };
    await render();
    expect(id<HTMLInputElement>('settings-ravepage-app-origin')?.value).toBe('https://app.custom.example');
    await click(id('settings-ravepage-reset')!);
    expect(id<HTMLInputElement>('settings-ravepage-app-origin')?.value).toBe(RAVEPAGE_DEFAULT_INSTANCE.appOrigin);
    expect(storedInstance()).toEqual(RAVEPAGE_DEFAULT_INSTANCE);
  });
});
