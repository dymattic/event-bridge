// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import type { Performer, Slot } from '../../src/core/schema';
import { asIsoUtc } from '../../src/core/time';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// Reuse performer-search: an exact "Example DJ" match resolves to a vrc.tl id.
vi.mock('../../src/ui/dashboard/lib/performer-search', () => ({
  createPerformerSearch: () => ({
    search: (q: string) =>
      Promise.resolve(q.toLowerCase().includes('example') ? [{ id: 'merged:example dj', name: 'Example DJ', subtitle: 'vrc.tl' }] : []),
    resolve: (id: string | null | undefined) =>
      id === 'merged:example dj' ? { name: 'Example DJ', aliases: [{ platform: 'vrctl', id: '300001', name: 'Example DJ' }] } : undefined,
  }),
}));

import { PerformerResolver } from '../../src/ui/dashboard/components/PerformerResolver';

const START = asIsoUtc('2030-01-05T22:00:00.000Z');
function slot(performers: Performer[]): Slot {
  return { order: 1, start: START, performers, dancers: [] };
}

let container: HTMLElement;
let root: Root;

async function render(ui: React.JSX.Element): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <NotificationProvider>
          {ui}
          <Toast />
        </NotificationProvider>
      </TooltipProvider>,
    );
  });
  for (let i = 0; i < 4; i++) await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.replaceChildren();
});

describe('PerformerResolver', () => {
  it('renders nothing when no target requires ids', async () => {
    await render(<PerformerResolver lineup={[slot([{ name: 'Example DJ', aliases: [] }])]} targets={['vrcpop']} onResolve={() => undefined} />);
    expect(container.querySelector('[data-testid="performer-resolver"]')).toBeNull();
  });

  it('auto-resolves an exact match on vrc.tl and calls onResolve with the alias', async () => {
    const calls: { slotIdx: number; perfIdx: number; alias: unknown }[] = [];
    await render(
      <PerformerResolver
        lineup={[slot([{ name: 'Example DJ', aliases: [] }])]}
        targets={['vrctl']}
        onResolve={(slotIdx, perfIdx, alias) => calls.push({ slotIdx, perfIdx, alias })}
      />,
    );
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({ slotIdx: 0, perfIdx: 0, alias: { platform: 'vrctl', id: '300001', name: 'Example DJ' } });
  });

  it('shows a picker for an unresolved (non-matching) performer', async () => {
    await render(<PerformerResolver lineup={[slot([{ name: 'Nobody', aliases: [] }])]} targets={['vrctl']} onResolve={() => undefined} />);
    expect(container.querySelector('[data-testid="performer-resolver"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="resolve-0-0"]')).toBeTruthy();
  });
});
