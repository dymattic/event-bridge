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
});
