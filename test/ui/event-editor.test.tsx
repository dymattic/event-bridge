// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import { clearResourceCache } from '../../src/ui/lib/resource';
import { emptyForm, toCore } from '../../src/ui/lib/event-form';
import { renderPreview } from '../../src/core/planner';
import type { EventCore } from '../../src/core/schema';
import type { PlatformConn, PlatformData } from '../../src/ui/dashboard/lib/event-data';

const h = vi.hoisted(() => ({
  conns: {} as Record<string, PlatformConn>,
  data: {} as Record<string, PlatformData>,
  store: {} as Record<string, unknown>,
}));

vi.mock('../../src/shared/webext', () => ({
  ext: {
    tabs: { create: () => Promise.resolve({}) },
    permissions: { contains: () => Promise.resolve(true), request: () => Promise.resolve(true) },
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

vi.mock('../../src/ui/dashboard/lib/event-data', () => ({
  loadConnections: () => Promise.resolve(h.conns),
  loadPlatformData: (p: string) => Promise.resolve(h.data[p] ?? { clubs: [], events: [] }),
  loadGenreVocab: () => Promise.resolve([]),
  readEventCore: () => Promise.resolve(undefined),
  paceHost: () => Promise.resolve(),
}));

vi.mock('../../src/ui/dashboard/lib/performer-search', () => ({
  createPerformerSearch: () => ({ search: () => Promise.resolve([]), resolve: () => undefined }),
}));

import EventEditor from '../../src/ui/dashboard/views/EventEditor';
import { getAdapter } from '../../src/adapters/registry';

let container: HTMLElement;
let root: Root;

async function render(): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <NotificationProvider>
          <EventEditor mode="create" />
          <Toast />
        </NotificationProvider>
      </TooltipProvider>,
    );
  });
  for (let i = 0; i < 4; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  }
}

function byId<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return container.querySelector(`[data-testid="${id}"]`) as T | null;
}

async function click(el: Element | null): Promise<void> {
  await act(async () => {
    (el as HTMLElement | null)?.click();
    await new Promise((r) => setTimeout(r, 0));
  });
}

// Radix Tabs activate on mousedown/focus (automatic activation), not a bare click().
async function selectTab(name: string): Promise<void> {
  const trigger = byId(`editor-tab-${name}`);
  await act(async () => {
    trigger?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    await new Promise((r) => setTimeout(r, 0));
  });
}

function setInputValue(el: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

async function pickOption(testid: string, label: string): Promise<void> {
  const trigger = container.querySelector(`[data-testid="${testid}"] button`);
  await click(trigger);
  const opt = [...document.body.querySelectorAll('button')].find((b) => (b.textContent ?? '').trim() === label);
  await click(opt ?? null);
}

beforeEach(() => {
  clearResourceCache();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  h.store = {};
  h.conns = { vrctl: { connected: true }, vrcpop: { connected: true }, ravepage: { connected: true } };
  h.data = {
    vrctl: { clubs: [{ id: '9001', organizerType: 'group', name: 'Example Club', canOrganize: true }], events: [] },
    vrcpop: { clubs: [{ id: 'grp_a', organizerType: 'group', name: 'Pop Club', vrchatGroupId: 'grp_a', canOrganize: true }], events: [] },
    ravepage: { clubs: [{ id: 'grp_b', organizerType: 'group', name: 'Rave Club', canOrganize: true }], events: [] },
  };
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.replaceChildren();
});

describe('EventEditor targets', () => {
  it('offers only enabled platforms as targets (rave.page off by default)', async () => {
    await render();
    expect(byId('editor-target-vrctl')).toBeTruthy();
    expect(byId('editor-target-vrcpop')).toBeTruthy();
    expect(byId('editor-target-ravepage')).toBeNull();
  });

  it('offers rave.page as a target when the integration is on', async () => {
    h.store = { settings: { experimental: { ravepage: true } } };
    await render();
    expect(byId('editor-target-ravepage')).toBeTruthy();
  });
});

describe('EventEditor vrc.tl NSFW gate', () => {
  it('surfaces the NSFW required item and disables Run until content rating is set', async () => {
    await render();
    await click(byId('editor-target-vrctl'));
    await selectTab('review');

    const card = byId('editor-review-vrctl');
    expect(card?.textContent ?? '').toContain('requires flags.nsfw');
    expect((byId('editor-run') as HTMLButtonElement | null)?.disabled).toBe(true);

    // Set a content rating; the NSFW-required item clears.
    await selectTab('details');
    await click(byId('editor-nsfw-sfw'));
    await selectTab('review');
    expect(byId('editor-review-vrctl')?.textContent ?? '').not.toContain('requires flags.nsfw');
  });

  it('enables Run once a club, title, start and content rating are provided', async () => {
    await render();
    await click(byId('editor-target-vrctl'));
    await pickOption('editor-club-vrctl', 'Example Club');
    setInputValue(byId('editor-title') as HTMLInputElement, 'Warehouse Night');
    await act(async () => {
      setInputValue(byId('editor-start') as HTMLInputElement, '2027-01-01T22:00');
      await new Promise((r) => setTimeout(r, 0));
    });
    await selectTab('details');
    await click(byId('editor-nsfw-sfw'));
    await selectTab('review');
    expect((byId('editor-run') as HTMLButtonElement | null)?.disabled).toBe(false);
  });
});

describe('EventEditor derived end (P7.1)', () => {
  it('has no End input on Basics and moves Doors under a "More times" disclosure', async () => {
    await render();
    expect(byId('editor-end')).toBeNull(); // the End field is gone
    expect(byId('editor-start')).toBeTruthy();
    expect(byId('editor-more-times')).toBeTruthy();
    expect(byId('editor-doors')).toBeTruthy(); // still present, inside the disclosure
  });

  it('shows the derived end in Review (default duration when there is no lineup)', async () => {
    await render();
    await click(byId('editor-target-vrcpop'));
    setInputValue(byId('editor-title') as HTMLInputElement, 'Duration Night');
    await act(async () => {
      setInputValue(byId('editor-start') as HTMLInputElement, '2027-01-01T22:00');
      await new Promise((r) => setTimeout(r, 0));
    });
    await selectTab('review');
    const ends = byId('editor-end-vrcpop');
    expect(ends?.textContent ?? '').toContain('Ends');
    expect(ends?.textContent ?? '').toContain('default 2 h'); // no lineup -> settings default 120 min
  });
});

describe('EventEditor vrcpop publish confirm', () => {
  it('toggling publish on for vrcpop opens the red confirm dialog', async () => {
    await render();
    await click(byId('editor-target-vrcpop'));
    await selectTab('review');
    await click(byId('editor-publish-vrcpop'));
    expect(document.body.textContent ?? '').toContain('This publishes PUBLICLY on vrcpop.com immediately');
  });
});

describe('EventEditor payload preview', () => {
  it('preview text equals renderPreview of planCreate for the same form', async () => {
    h.store = { settings: { experimental: { ravepage: true } } };
    await render();
    await click(byId('editor-target-ravepage'));
    setInputValue(byId('editor-title') as HTMLInputElement, 'Preview Night');
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    // Editor's create-mode default zone is the browser zone (this same process).
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await selectTab('review');
    const previewText = byId('editor-preview-ravepage')?.textContent ?? '';

    const f = emptyForm(zone);
    f.title = 'Preview Night';
    const core: EventCore = { ...toCore(f), visibility: { ...toCore(f).visibility, publish: false } };
    const expected = getAdapter('ravepage')
      .planCreate(core, { organizer: { organizerType: '', organizerId: '' }, publish: false, genreVocab: {} })
      .steps.map(renderPreview)
      .join('\n\n');

    expect(previewText).toBe(expected);
  });
});
