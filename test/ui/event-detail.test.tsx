// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import type { EventCore } from '../../src/core/schema';
import { clearResourceCache } from '../../src/ui/lib/resource';

const h = vi.hoisted(() => ({ core: null as EventCore | null }));

vi.mock('../../src/shared/webext', () => ({
  ext: { tabs: { create: () => Promise.resolve({}) } },
}));

vi.mock('../../src/ui/dashboard/lib/event-data', () => ({
  readEventCore: () => Promise.resolve(h.core),
  deletePreview: () => ['Delete event 100001 [vrcpop:delete]'],
  executeDelete: () => Promise.resolve(),
  loadConnections: () => Promise.resolve({}),
  loadPlatformData: () => Promise.resolve({ clubs: [], events: [] }),
}));

import EventDetail from '../../src/ui/dashboard/views/EventDetail';

function makeCore(): EventCore {
  return {
    title: "what's poppin",
    description: 'A cozy night.',
    start: asIsoUtc('2027-01-01T20:00:00Z'),
    end: asIsoUtc('2027-01-01T22:00:00Z'),
    zone: asIanaZone('Europe/Berlin'),
    organizer: { name: 'Example Club', vrchatGroupId: 'grp_a', platformIds: { vrcpop: 'grp_a' } },
    lineup: [
      {
        order: 1,
        start: asIsoUtc('2027-01-01T20:00:00Z'),
        end: asIsoUtc('2027-01-01T21:00:00Z'),
        performers: [
          { name: 'Example DJ', aliases: [] },
          { name: 'Second DJ', aliases: [] },
        ],
        dancers: [],
      },
    ],
    hosts: [{ name: 'Host One', aliases: [] }],
    dancers: [],
    poster: { kind: 'url', url: 'https://example.invalid/p.png' },
    visibility: { publish: true, audience: 'public' },
    flags: { nsfw: true, openDecks: true },
    music: { genres: ['Trance'] },
    links: { twitch: 'https://twitch.tv/example' },
    extras: { vrcpop: { id: 100001, version: 2 } },
  };
}

let container: HTMLElement;
let root: Root;

async function render(): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <NotificationProvider>
          <EventDetail platform="vrcpop" id="100001" />
          <Toast />
        </NotificationProvider>
      </TooltipProvider>,
    );
  });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
}

beforeEach(() => {
  clearResourceCache();
  h.core = makeCore();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const RAW_ID = /^(grp_|evt_|usr_)|^user \d+$/;

describe('EventDetail view', () => {
  it('renders resolved title, organizer, lineup performer names (B2B), flags, genres', async () => {
    await render();
    const text = container.textContent ?? '';
    expect(text).toContain("what's poppin");
    expect(text).toContain('Example Club');
    expect(container.querySelector('[data-testid="event-detail-lineup"]')?.textContent ?? '').toContain('Example DJ');
    expect(container.querySelector('[data-testid="event-detail-lineup"]')?.textContent ?? '').toContain('Second DJ');
    expect(container.querySelector('[data-testid="event-detail-lineup"]')?.textContent ?? '').toContain('b2b');
    expect(text).toContain('NSFW');
    expect(text).toContain('Trance');
    expect(text).toContain('Host One');
  });

  it('shows the poster preview and open/edit/delete actions', async () => {
    await render();
    expect(container.querySelector('[data-testid="event-detail-poster"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="event-detail-open"]')).toBeTruthy();
    const edit = container.querySelector('[data-testid="event-detail-edit"]') as HTMLButtonElement | null;
    expect(edit?.disabled).toBe(true);
    expect(container.querySelector('[data-testid="event-detail-delete"]')).toBeTruthy();
  });

  it('keeps raw ids out of the resolved fields (only inside the raw disclosure)', async () => {
    await render();
    const title = container.querySelector('[data-testid="event-detail-title"]')?.textContent?.trim() ?? '';
    const org = container.querySelector('[data-testid="event-detail-organizer"]')?.textContent?.trim() ?? '';
    expect(RAW_ID.test(title)).toBe(false);
    expect(RAW_ID.test(org)).toBe(false);
    // the raw ids ARE available for debugging in the collapsed disclosure
    expect(container.querySelector('[data-testid="event-detail-raw"]')?.textContent ?? '').toContain('grp_a');
  });
});
