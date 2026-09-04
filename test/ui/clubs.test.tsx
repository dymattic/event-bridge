// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import { clearResourceCache } from '../../src/ui/lib/resource';
import type { PlatformData, PlatformConn } from '../../src/ui/dashboard/lib/event-data';

const h = vi.hoisted(() => ({
  conns: {} as Record<string, PlatformConn>,
  data: {} as Record<string, PlatformData>,
  store: {} as Record<string, unknown>,
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
  loadConnections: () => Promise.resolve(h.conns),
  loadPlatformData: (p: string) => Promise.resolve(h.data[p] ?? { clubs: [], events: [] }),
}));

import Clubs from '../../src/ui/dashboard/views/Clubs';

const GRP = 'grp_00000000-0000-4000-8000-000000000001';

let container: HTMLElement;
let root: Root;

async function render(): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <NotificationProvider>
          <Clubs />
          <Toast />
        </NotificationProvider>
      </TooltipProvider>,
    );
  });
  for (let i = 0; i < 6; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  }
}

async function click(testId: string): Promise<void> {
  const el = container.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
  if (!el) throw new Error(`no element ${testId}`);
  await act(async () => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
  });
  for (let i = 0; i < 4; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  }
}

beforeEach(() => {
  clearResourceCache();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  h.store = { settings: { experimental: { ravepage: false } } };
  h.conns = { vrctl: { connected: true }, vrcpop: { connected: true }, ravepage: { connected: false } };
  h.data = {
    vrctl: { clubs: [{ id: '9001', organizerType: 'group', name: 'Example Club', canOrganize: true }], events: [] },
    vrcpop: { clubs: [{ id: GRP, organizerType: 'group', name: 'Example Club', vrchatGroupId: GRP, canOrganize: true }], events: [] },
    ravepage: { clubs: [], events: [] },
  };
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('Clubs view', () => {
  it('shows a link picker for the platform missing from an anchor', async () => {
    await render();
    // grp anchor lacks vrc.tl -> a vrc.tl link picker; solo vrctl anchor lacks vrcpop.
    expect(container.querySelector('[data-testid="club-link-vrctl"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="club-link-vrcpop"]')).toBeTruthy();
  });

  it('a stored club link collapses to one anchor with an Unlink on the linked member', async () => {
    h.store.clubLinks = [{ anchorId: GRP, members: { vrctl: { organizerId: '9001', name: 'Example Club' } } }];
    await render();
    expect(container.querySelector('[data-testid="club-cell-vrctl"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="club-cell-vrcpop"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="club-unlink-vrctl"]')).toBeTruthy();
    // no picker left for either platform in this single, complete anchor
    expect(container.querySelector('[data-testid="club-link-vrctl"]')).toBeNull();
  });

  it('Unlink removes the club member from storage', async () => {
    h.store.clubLinks = [{ anchorId: GRP, members: { vrctl: { organizerId: '9001', name: 'Example Club' } } }];
    await render();
    await click('club-unlink-vrctl');
    expect(h.store.clubLinks).toEqual([]);
    // the vrc.tl club is a standalone anchor again -> its picker returns
    expect(container.querySelector('[data-testid="club-link-vrctl"]')).toBeTruthy();
  });

  it('empty state when nothing is connected', async () => {
    h.conns = { vrctl: { connected: false }, vrcpop: { connected: false }, ravepage: { connected: false } };
    await render();
    expect(container.querySelector('[data-testid="clubs-none-connected"]')).toBeTruthy();
  });
});
