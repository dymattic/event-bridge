// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import { clearResourceCache } from '../../src/ui/lib/resource';
import type { JobRecord } from '../../src/runtime/jobs';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const h = vi.hoisted(() => ({ store: {} as Record<string, unknown> }));
vi.mock('../../src/shared/webext', () => ({
  ext: {
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

import Jobs from '../../src/ui/dashboard/views/Jobs';

const JOBS: JobRecord[] = [
  {
    id: 'j2', kind: 'sync', title: 'Rave B', startedAt: '2026-09-04T10:00:00Z', status: 'running',
    targets: ['vrctl'], refs: [{ platform: 'vrctl', id: '2' }], steps: [{ stepId: 'finalize', platform: 'vrctl', status: 'running', preview: '{"name":"Rave B"}' }],
  },
  {
    id: 'j1', kind: 'create', title: 'Rave A', startedAt: '2026-09-04T09:00:00Z', finishedAt: '2026-09-04T09:01:00Z', status: 'done',
    targets: ['vrcpop', 'vrctl'], refs: [{ platform: 'vrcpop', id: '1' }], steps: [{ stepId: 'create', platform: 'vrcpop', status: 'done', preview: '{"event_name":"Rave A"}' }],
  },
];

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
          <Jobs />
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
  clearResourceCache();
  h.store = { jobs: structuredClone(JOBS) };
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.replaceChildren();
});

describe('Jobs view', () => {
  it('renders a row per job with its title, kind and step preview', async () => {
    await render();
    expect(q('jobs-count')?.textContent).toContain('2 jobs');
    expect(container.textContent).toContain('Rave A');
    expect(container.textContent).toContain('Rave B');
    expect(container.textContent).toContain('event_name'); // step preview rendered in the details
  });

  it('Clear finished keeps only running jobs', async () => {
    await render();
    await click(q('jobs-clear'));
    expect(container.textContent).toContain('Rave B'); // running stays
    expect(container.textContent).not.toContain('Rave A'); // finished cleared
    expect(h.store.jobs).toHaveLength(1);
  });

  it('shows an empty state when there are no jobs', async () => {
    h.store = { jobs: [] };
    await render();
    expect(q('jobs-empty')).toBeTruthy();
  });
});
