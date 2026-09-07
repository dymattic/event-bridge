// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import type { EventCore } from '../../src/core/schema';
import type { AnnouncePreset } from '../../src/core/discord';
import { clearResourceCache } from '../../src/ui/lib/resource';

// This spec drives clicks/typing (state updates outside render) — opt into act().
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const START = '2027-01-01T20:00:00Z';
const UNIX = Math.floor(Date.parse(START) / 1000);

const h = vi.hoisted(() => ({
  store: {} as Record<string, unknown>,
  core: null as EventCore | null,
  writeText: vi.fn((_t: string) => Promise.resolve()),
}));

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

vi.mock('../../src/ui/dashboard/lib/event-data', () => ({
  loadConnections: () =>
    Promise.resolve({
      vrctl: { connected: false },
      vrcpop: { connected: true },
      ravepage: { connected: false },
    }),
  loadPlatformData: (p: string) =>
    Promise.resolve(
      p === 'vrcpop'
        ? { clubs: [], events: [{ platform: 'vrcpop', id: '100001', title: "what's poppin", start: '2030-01-05T22:00:00Z', status: 'published', clubId: 'c1', clubName: 'Example Club' }] }
        : { clubs: [], events: [] },
    ),
  readEventCore: () => Promise.resolve(h.core),
}));

vi.mock('../../src/runtime/link-store', () => ({
  listLinks: () =>
    Promise.resolve([
      { anchorId: 'a1', createdAt: 't', refs: [{ platform: 'vrcpop', id: '100001' }, { platform: 'vrctl', id: '200001' }] },
    ]),
}));

vi.mock('../../src/ui/lib/platform-urls', () => ({
  publicEventUrl: (p: string) => Promise.resolve(p === 'vrcpop' ? 'https://vrcpop.com/event/100001' : 'https://vrc.tl/event/200001'),
}));

import Announce from '../../src/ui/dashboard/views/Announce';

function makeCore(): EventCore {
  return {
    title: "what's poppin",
    description: 'A cozy night.',
    start: asIsoUtc(START),
    end: asIsoUtc('2027-01-01T23:00:00Z'),
    zone: asIanaZone('Europe/Berlin'),
    organizer: { name: 'Example Club', vrchatGroupId: 'grp_a', platformIds: { vrcpop: 'grp_a' } },
    lineup: [
      {
        order: 1,
        start: asIsoUtc('2027-01-01T20:00:00Z'),
        end: asIsoUtc('2027-01-01T21:00:00Z'),
        performers: [
          { name: 'Aurora', aliases: [] },
          { name: 'Blaze', aliases: [] },
        ],
        dancers: [],
      },
      {
        order: 2,
        start: asIsoUtc('2027-01-01T21:00:00Z'),
        end: asIsoUtc('2027-01-01T22:00:00Z'),
        performers: [{ name: 'Cascade', aliases: [] }],
        dancers: [],
      },
    ],
    hosts: [],
    dancers: [],
    visibility: { publish: true, audience: 'public' },
    flags: {},
    music: { genres: ['Trance'] },
    links: {},
    extras: {},
  };
}

let container: HTMLElement;
let root: Root;

async function flush(): Promise<void> {
  for (let i = 0; i < 6; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  }
}
async function render(query: string): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <NotificationProvider>
          <Announce query={query} />
          <Toast />
        </NotificationProvider>
      </TooltipProvider>,
    );
  });
  await flush();
}
function id<T extends HTMLElement = HTMLElement>(testid: string): T | null {
  return container.querySelector(`[data-testid="${testid}"]`);
}
async function click(el: Element | null): Promise<void> {
  await act(async () => {
    (el as HTMLElement | null)?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await flush();
}
function setTextareaVal(el: HTMLTextAreaElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}
async function pickPreset(label: string): Promise<void> {
  const trigger = id('announce-preset-select')!.querySelector('button[aria-haspopup="listbox"]');
  await click(trigger);
  // Option buttons portal to <body>; builtins append a "built-in" meta line, so
  // match by prefix and skip the trigger itself.
  const opt = [...document.body.querySelectorAll('button')].find(
    (b) => !b.hasAttribute('aria-haspopup') && (b.textContent?.trim().startsWith(label) ?? false),
  );
  await click(opt ?? null);
}
const previewText = (): string => (id<HTMLTextAreaElement>('announce-raw')?.value ?? '');

beforeEach(() => {
  clearResourceCache();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  h.store = {};
  h.core = makeCore();
  h.writeText = vi.fn((_t: string) => Promise.resolve());
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: h.writeText }, configurable: true });
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('Announce view', () => {
  it('(a) preselects from the query; preview has <t:> and both public URLs, no raw ids as labels', async () => {
    await render('platform=vrcpop&id=100001');
    const text = previewText();
    expect(text).toContain(`<t:${UNIX}:`); // event start timestamp
    expect(text).toContain('https://vrcpop.com/event/100001');
    expect(text).toContain('https://vrc.tl/event/200001');
    // markdown link labels are platform NAMES, never ids
    expect(text).toContain('[vrc.tl](https://vrc.tl/event/200001)');
    expect(text).toContain('[vrcpop.com](https://vrcpop.com/event/100001)');
    expect(text).not.toMatch(/grp_/);
    // resolved-link chips under the picker
    expect(id('announce-link-vrcpop')).toBeTruthy();
    expect(id('announce-link-vrctl')).toBeTruthy();
  });

  it('(b) switching preset to Compact changes the preview', async () => {
    await render('platform=vrcpop&id=100001');
    const classic = previewText();
    expect(classic).toContain('**LINEUP**'); // classic marker
    await pickPreset('Compact');
    const compact = previewText();
    expect(compact).not.toBe(classic);
    expect(compact).not.toContain('**LINEUP**');
  });

  it('(c) Duplicate to edit yields an editable copy; slot edit updates preview live; Save persists', async () => {
    await render('platform=vrcpop&id=100001');
    await click(id('announce-preset-duplicate')); // builtin -> "Duplicate to edit"
    const slot = id<HTMLTextAreaElement>('announce-preset-slot')!;
    expect(slot.readOnly).toBe(false);
    await act(async () => setTextareaVal(slot, 'SET {performers}'));
    await flush();
    expect(previewText()).toContain('SET Aurora & Blaze'); // live, unsaved
    await click(id('announce-preset-save'));
    const stored = h.store.announcePresets as AnnouncePreset[];
    expect(stored).toHaveLength(1);
    expect(stored[0]?.slotLine).toBe('SET {performers}');
    expect(stored[0]?.builtin).toBe(false);
  });

  it('(d) Delete removes the preset and selection falls back to the first builtin', async () => {
    await render('platform=vrcpop&id=100001');
    await click(id('announce-preset-duplicate'));
    expect((h.store.announcePresets as AnnouncePreset[]).length).toBe(1);
    await click(id('announce-preset-delete')); // opens ConfirmDialog
    const dialog = document.body.querySelector('[role="dialog"]');
    const confirm = [...(dialog?.querySelectorAll('button') ?? [])].find((b) => b.textContent?.trim() === 'Delete');
    await click(confirm ?? null);
    expect((h.store.announcePresets as AnnouncePreset[]).length).toBe(0);
    expect(id<HTMLInputElement>('announce-preset-name')?.value).toBe('Classic'); // first builtin
    expect(id<HTMLInputElement>('announce-preset-name')?.readOnly).toBe(true);
  });

  it('(e) Copy calls the clipboard with the preview text and shows a toast', async () => {
    await render('platform=vrcpop&id=100001');
    const text = previewText();
    await click(id('announce-copy'));
    expect(h.writeText).toHaveBeenCalledWith(text);
    expect(document.body.textContent ?? '').toContain('Copied to clipboard');
  });

  it('(f) a >2000-char preview shows the limit warning badge', async () => {
    const long: AnnouncePreset = {
      id: 'user-long',
      name: 'Long',
      builtin: false,
      header: '**{title}**',
      slotLine: '{performers}',
      footer: '{description}',
      emptyLineup: '',
      createdAt: 't',
      updatedAt: 't',
    };
    h.store.announcePresets = [long];
    h.core = makeCore();
    h.core.description = 'a'.repeat(2500);
    await render('platform=vrcpop&id=100001&preset=user-long');
    expect(previewText().length).toBeGreaterThan(2000);
    expect(id('announce-over-limit')).toBeTruthy();
  });
});
