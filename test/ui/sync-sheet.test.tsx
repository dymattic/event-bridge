// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import type { EventLink } from '../../src/runtime/link-store';
import type { Settings } from '../../src/runtime/settings';
import type { AssessedLink } from '../../src/ui/dashboard/lib/sync';
import type { SyncAssessment, LinkSync } from '../../src/ui/lib/sync-plan';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import type { EventCore } from '../../src/core/schema';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const h = vi.hoisted(() => ({
  applyCalls: [] as { source: string; resolutions?: unknown }[],
}));

vi.mock('../../src/shared/webext', () => ({
  ext: {
    storage: {
      local: { get: () => Promise.resolve({}), set: () => Promise.resolve() },
      onChanged: { addListener: () => undefined, removeListener: () => undefined },
    },
  },
}));

vi.mock('../../src/ui/dashboard/lib/sync', () => ({
  effectiveSync: (link: EventLink, settings: Settings): LinkSync => link.sync ?? settings.sync,
  assessLink: (link: EventLink): Promise<AssessedLink> =>
    Promise.resolve({ link, assessment: { state: 'in-sync', changedSince: [], targets: [] }, cores: {}, hashes: {}, sync: link.sync!, title: 'Rave' }),
  applySync: (link: EventLink, _a: unknown, opts: { source: string; resolutions?: unknown }) => {
    h.applyCalls.push({ source: opts.source, resolutions: opts.resolutions });
    return Promise.resolve({ results: [{ platform: 'vrctl', ok: true }], link });
  },
  setBaseline: (link: EventLink) => Promise.resolve(link),
}));

import { SyncSheet } from '../../src/ui/dashboard/components/SyncSheet';

const START = asIsoUtc('2030-01-05T22:00:00.000Z');
function core(title: string): EventCore {
  return {
    title, start: START, zone: asIanaZone('UTC'), organizer: { name: '', platformIds: {} }, lineup: [], hosts: [], dancers: [],
    visibility: { publish: false, audience: 'unlisted' }, flags: {}, music: { genres: [] }, links: {}, extras: {},
  };
}
const SYNC: LinkSync = { mode: 'notify', source: 'last-edited', fields: { details: true, lineup: true, poster: true, publishState: false } };
const SETTINGS = { sync: SYNC } as unknown as Settings;
const LINK: EventLink = { anchorId: 'a1', refs: [{ platform: 'vrcpop', id: '1' }, { platform: 'vrctl', id: '2' }], createdAt: 't', sync: SYNC };

function assessed(assessment: SyncAssessment): AssessedLink {
  return { link: LINK, assessment, cores: { vrcpop: core('New'), vrctl: core('Old') }, hashes: {}, sync: SYNC, title: 'Rave' };
}

let container: HTMLElement;
let root: Root;
const q = (id: string): HTMLElement | null => document.body.querySelector(`[data-testid="${id}"]`);
async function flush(): Promise<void> {
  for (let i = 0; i < 4; i++) await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
}
async function render(initial: AssessedLink): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <NotificationProvider>
          <SyncSheet link={LINK} settings={SETTINGS} connected={['vrcpop', 'vrctl']} initialAssessed={initial} onClose={() => undefined} onChanged={() => undefined} />
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
  h.applyCalls = [];
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.replaceChildren();
});

const PENDING: SyncAssessment = {
  state: 'pending', source: 'vrcpop', changedSince: ['vrcpop'],
  targets: [{ platform: 'vrctl', changes: [{ path: 'details.title', from: 'Old', to: 'New' }], conflict: false }],
};
const CONFLICT: SyncAssessment = {
  state: 'conflict', source: 'vrcpop', changedSince: ['vrcpop', 'vrctl'],
  targets: [{ platform: 'vrctl', changes: [{ path: 'details.title', from: 'Old', to: 'New' }], conflict: true }],
};

describe('SyncSheet', () => {
  it('renders the sheet, a pending target change, and an enabled Apply', async () => {
    await render(assessed(PENDING));
    expect(q('sync-sheet')).toBeTruthy();
    expect(q('sync-assessment')?.textContent ?? '').toContain('title');
    expect((q('sync-apply') as HTMLButtonElement).disabled).toBe(false);
  });

  it('applies with the assessment source', async () => {
    await render(assessed(PENDING));
    await click(q('sync-apply'));
    expect(h.applyCalls).toHaveLength(1);
    expect(h.applyCalls[0]?.source).toBe('vrcpop');
  });

  it('disables Apply on a conflict until a per-field pick, then applies with the resolution', async () => {
    await render(assessed(CONFLICT));
    expect((q('sync-apply') as HTMLButtonElement).disabled).toBe(true);
    expect(q('sync-pick-details.title')).toBeTruthy();
    await click(q('sync-pick-details.title-source'));
    expect((q('sync-apply') as HTMLButtonElement).disabled).toBe(false);
    await click(q('sync-apply'));
    expect(h.applyCalls).toHaveLength(1);
    expect(h.applyCalls[0]?.resolutions).toMatchObject({ vrctl: { 'details.title': 'source' } });
  });
});
