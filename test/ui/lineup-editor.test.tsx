// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '@rave-page/ui';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import type { Slot } from '../../src/core/schema';
import type { Platform } from '../../src/shared/agent-protocol';

// performer-search wraps the adapter registry (webext); mock it so the editor
// renders without the runtime. The board's own search UI is exercised in e2e.
vi.mock('../../src/ui/dashboard/lib/performer-search', () => ({
  createPerformerSearch: () => ({ search: () => Promise.resolve([]), resolve: () => undefined }),
}));

import { LineupEditor } from '../../src/ui/dashboard/components/LineupEditor';

const ZONE = asIanaZone('Europe/Berlin');
const EVENT_START = asIsoUtc('2026-09-10T20:00:00.000Z');

function twoSlots(): Slot[] {
  return [
    {
      order: 1,
      start: asIsoUtc('2026-09-10T20:00:00.000Z'),
      end: asIsoUtc('2026-09-10T21:00:00.000Z'),
      title: 'Opening',
      performers: [{ name: 'DJ A', aliases: [{ platform: 'vrctl', id: '55501', name: 'DJ A' }] }],
      dancers: [],
    },
    {
      order: 2,
      start: asIsoUtc('2026-09-10T21:00:00.000Z'),
      end: asIsoUtc('2026-09-10T22:00:00.000Z'),
      title: 'Headliner',
      performers: [{ name: 'DJ B', aliases: [] }],
      dancers: [],
    },
  ];
}

// slot 2 starts 30 min after slot 1 ends -> a gap
function gappy(): Slot[] {
  return [
    { order: 1, start: asIsoUtc('2026-09-10T20:00:00.000Z'), end: asIsoUtc('2026-09-10T21:00:00.000Z'), performers: [{ name: 'DJ A', aliases: [] }], dancers: [] },
    { order: 2, start: asIsoUtc('2026-09-10T21:30:00.000Z'), end: asIsoUtc('2026-09-10T22:30:00.000Z'), performers: [{ name: 'DJ B', aliases: [] }], dancers: [] },
  ];
}

let container: HTMLElement;
let root: Root;

interface RenderOpts {
  value: Slot[];
  targets?: Platform[];
  onChange?: (next: Slot[]) => void;
}

async function render({ value, targets = [], onChange = () => undefined }: RenderOpts): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <LineupEditor value={value} onChange={onChange} eventStart={EVENT_START} zone={ZONE} targets={targets} />
      </TooltipProvider>,
    );
  });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('LineupEditor', () => {
  it('renders slot titles and performer names, with no raw ids in the DOM', async () => {
    await render({ value: twoSlots(), targets: ['vrctl'] });
    const text = container.textContent ?? '';
    expect(text).toContain('Opening');
    expect(text).toContain('Headliner');
    expect(text).toContain('DJ A');
    expect(text).toContain('DJ B');
    // alias platform hint shows the display name, never the raw platform id
    expect(text).toContain('vrc.tl');
    expect(container.innerHTML).not.toContain('55501');
  });

  it('emits onChange with swapped slot order when a slot move-down is clicked', async () => {
    const changes: Slot[][] = [];
    await render({ value: twoSlots(), targets: ['ravepage'], onChange: (n) => changes.push(n) });
    const moveDown = Array.from(container.querySelectorAll<HTMLButtonElement>('[aria-label="Move down"]')).find((b) => !b.disabled);
    expect(moveDown).toBeTruthy();
    await act(async () => {
      moveDown?.click();
    });
    expect(changes).toHaveLength(1);
    const next = changes[0] ?? [];
    expect(next[0]?.performers[0]?.name).toBe('DJ B');
    expect(next[0]?.order).toBe(1);
    expect(next[1]?.performers[0]?.name).toBe('DJ A');
    expect(next[1]?.order).toBe(2);
  });

  it('shows "Make contiguous" only when a no-gaps target is selected and gaps exist', async () => {
    const hasContiguous = (): boolean =>
      Array.from(container.querySelectorAll('button')).some((b) => (b.textContent ?? '').includes('Make contiguous'));

    await render({ value: gappy(), targets: ['ravepage'] });
    expect(hasContiguous()).toBe(false); // rave.page allows gaps

    await act(() => root.unmount());
    root = createRoot(container);
    await render({ value: gappy(), targets: ['vrctl'] });
    expect(hasContiguous()).toBe(true); // vrc.tl forbids gaps -> action offered
  });
});
