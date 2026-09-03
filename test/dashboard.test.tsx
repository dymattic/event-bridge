import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { App } from '../src/ui/dashboard/App';

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
