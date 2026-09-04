// rave.page dev-API mock for the events surface e2e: own groups, own events list,
// one event's detail (event + slots + performers), and delete. All 200/204 bodies
// (never a 3xx). Sanitized placeholder ids/names. Pairs with a seeded token so the
// adapter's Bearer resolver is satisfied without the connect handshake.
import type { BrowserContext, Page } from '@playwright/test';

export const RP_API = 'https://development.api.rave.page';
export const RP_USER = 'usr_00000000-0000-4000-8000-000000009001';
export const RP_GROUP = 'grp_00000000-0000-4000-8000-000000009001';
export const RP_EVENT_1 = 'evt_00000000-0000-4000-8000-0000000000e1';
export const RP_EVENT_2 = 'evt_00000000-0000-4000-8000-0000000000e2';

export interface RavepageRecorder {
  deleted: string[];
}
export function newRavepageRecorder(): RavepageRecorder {
  return { deleted: [] };
}

const EVENTS = [
  {
    id: RP_EVENT_1,
    title: 'Neon Cathedral',
    starts_at: '2027-02-01T20:00:00Z',
    ends_at: '2027-02-01T23:00:00Z',
    status: 'published',
    visibility: 'public',
    is_public: true,
    timezone: 'Europe/Berlin',
    organizer_id: RP_GROUP,
    description: 'A rave night.',
    scene_type: 'rave',
  },
  {
    id: RP_EVENT_2,
    title: 'Basement Draft',
    starts_at: '2027-02-05T21:00:00Z',
    status: 'draft',
    visibility: 'unlisted',
    is_public: false,
    timezone: 'Europe/Berlin',
    organizer_id: RP_GROUP,
  },
];

export async function mockRavepageEvents(context: BrowserContext, recorder: RavepageRecorder): Promise<void> {
  await context.route(/https:\/\/development\.rave\.page\//, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>rp</title>' }),
  );
  await context.route(/https:\/\/development\.api\.rave\.page\//, (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    const method = req.method();
    const json = (status: number, obj: unknown) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(obj) });

    if (method === 'GET' && path === '/auth/me') return json(200, { id: RP_USER, username: 'exampledj', display_name: 'Example DJ' });
    if (method === 'GET' && path === '/groups/mine') return json(200, [{ id: RP_GROUP, name: 'Neon Collective', can_organize_events: true }]);
    if (method === 'GET' && path === '/events/organizers') return json(200, []);
    if (method === 'GET' && path === '/events') return json(200, EVENTS);

    const detail = /^\/events\/([^/]+)$/.exec(path);
    if (method === 'GET' && detail) return json(200, EVENTS.find((e) => e.id === detail[1]) ?? EVENTS[0]);
    if (method === 'GET' && /^\/events\/[^/]+\/slots$/.test(path))
      return json(200, [{ id: 'slt_1', slot_number: 1, starts_at: '2027-02-01T20:00:00Z', ends_at: '2027-02-01T21:00:00Z' }]);
    if (method === 'GET' && /^\/events\/[^/]+\/performers$/.test(path))
      return json(200, [{ id: 'ep_1', slot_id: 'slt_1', stage_name: 'Aurora', performer_id: 'prf_1', billing_order: 1 }]);
    if (method === 'DELETE' && detail) {
      recorder.deleted.push(detail[1] ?? '');
      return route.fulfill({ status: 204, body: '' });
    }
    return json(404, { status: 'error', message: 'not found' });
  });
}

// Seed a valid stored token so the rave.page adapter is "connected" without the
// bridge handshake (mirrors ravepage-connect.spec's seedToken).
export async function seedRavepageToken(page: Page): Promise<void> {
  const auth = {
    apiBase: RP_API,
    token: 'seed-token',
    exp: new Date(Date.now() + 30 * 86_400_000).toISOString(),
    userId: RP_USER,
    label: 'Example DJ',
    obtainedAt: new Date().toISOString(),
  };
  await page.evaluate((a) => chrome.storage.local.set({ 'ravepage.auth': a }), auth);
}
