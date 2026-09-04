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

export const RP_NEW_EVENT = 'evt_00000000-0000-4000-8000-0000000000ff';

export interface RavepageRecorder {
  deleted: string[];
  created: Record<string, unknown>[];
  slots: Record<string, unknown>[];
  performers: Record<string, unknown>[];
  updated: Record<string, unknown>[];
}
export function newRavepageRecorder(): RavepageRecorder {
  return { deleted: [], created: [], slots: [], performers: [], updated: [] };
}

function parse(raw: string | null): Record<string, unknown> {
  try {
    return JSON.parse(raw ?? '{}') as Record<string, unknown>;
  } catch {
    return {};
  }
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
    if (method === 'GET' && path === '/performers') return json(200, [{ id: 'prf_1', name: 'Example DJ', slug: 'example-dj' }]);
    if (method === 'GET' && path === '/events') return json(200, EVENTS);

    // ---- writes (create flow) ----
    if (method === 'POST' && path === '/events') {
      const body = parse(req.postData());
      recorder.created.push(body);
      return json(201, { ...body, id: RP_NEW_EVENT, status: body.is_public ? 'published' : 'draft', slug: 'new-event' });
    }
    const slotM = /^\/events\/[^/]+\/slots$/.exec(path);
    if (method === 'POST' && slotM) {
      const body = parse(req.postData());
      recorder.slots.push(body);
      return json(201, { ...body, id: `slt_${recorder.slots.length}` });
    }
    const perfM = /^\/events\/[^/]+\/performers$/.exec(path);
    if (method === 'POST' && perfM) {
      const body = parse(req.postData());
      recorder.performers.push(body);
      return json(201, { ...body, id: `ep_${recorder.performers.length}` });
    }
    if ((method === 'PUT' || method === 'POST') && /\/genres$/.test(path)) return json(200, {});
    const updM = /^\/events\/([^/]+)$/.exec(path);
    if (method === 'PUT' && updM) {
      const body = parse(req.postData());
      recorder.updated.push(body);
      return json(200, { ...EVENTS[0], ...body, id: updM[1] });
    }

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
