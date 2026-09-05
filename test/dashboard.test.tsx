import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// App now imports the runtime (rave.page adapter) which pulls in the webext shim;
// mock it like the runtime tests so happy-dom (no chrome/browser global) can load.
const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { App } from '../src/ui/dashboard/App';
import { createFake } from './runtime/fake-ext';

beforeEach(() => {
  h.ext = createFake().ext;
});

async function renderApp(container: HTMLElement): Promise<ReturnType<typeof createRoot>> {
  const root = createRoot(container);
  await act(async () => {
    root.render(<App />);
  });
  // Flush the async getSettings() effect so footer/devPanels state settles.
  await act(async () => {
    await Promise.resolve();
  });
  return root;
}

describe('dashboard App', () => {
  it('renders the heading under happy-dom (React + react-jsx)', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(<App />);
    });
    expect(container.querySelector('h1')?.textContent).toContain('event-bridge');
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  it('hides the footer dev links by default (repo link + version stay)', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = await renderApp(container);
    expect(container.querySelector('[data-testid="footer-repo"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="footer-dev"]')).toBeNull();
    expect(container.querySelector('[data-testid="nav-Kit"]')).toBeNull();
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  it('shows the footer dev links when developer.panels is on', async () => {
    h.ext = createFake({ storage: { settings: { developer: { panels: true } } } }).ext;
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = await renderApp(container);
    expect(container.querySelector('[data-testid="footer-dev"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="nav-Kit"]')).not.toBeNull();
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});
