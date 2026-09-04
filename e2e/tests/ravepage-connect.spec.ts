// rave.page connect + draft round-trip against mocks only (no real platform).
// Self-contained: routes the bridge page + a mock dev API in-spec (does not use
// mockPlatform, whose rave.page variant is session/localStorage-based).
//
// Environment note: Playwright's Chromium does not intercept an extension-opened
// tab's INITIAL document, and does not deliver a MAIN-world `window.postMessage`
// to an executeScript-injected (ISOLATED-world) content script — both work in
// real Chrome. So this spec (1) pre-opens the bridge tab (Playwright-driven, so
// it's mocked) and reuses it, verifying the handshake up to the consent card
// (ensureAgent → inject → grantAwait → hello); and (2) verifies the connected
// session (groups + draft create/delete + recorded EventCreateIn) from a seeded
// token. The page→agent grant hop is unit-tested (grant.test.ts) and the
// exchange path in auth.test.ts.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { enableRavepage, expect, openDashboard, test } from '../fixtures/extension';
import type { BrowserContext, Page } from '@playwright/test';

const mocksDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'mocks');
const bridgeHtml = readFileSync(resolve(mocksDir, 'ravepage-bridge.html'), 'utf8');

const API_BASE = 'https://development.api.rave.page';
const BRIDGE_URL = 'https://development.rave.page/desktop/bridge?target=extension';
const USER_ID = 'usr_00000000-0000-4000-8000-000000009001';
const GROUP_ID = 'grp_00000000-0000-4000-8000-000000009001';
const EVENT_ID = 'evt_00000000-0000-4000-8000-0000000000e1';

interface Recorded {
  method: string;
  path: string;
  body: unknown;
}

async function mockRavepage(context: BrowserContext, recorded: Recorded[]): Promise<void> {
  await context.route(/https:\/\/development\.rave\.page\//, (route) => {
    const p = new URL(route.request().url()).pathname;
    const body = p.startsWith('/desktop/bridge') ? bridgeHtml : '<!doctype html><title>rp</title>';
    return route.fulfill({ contentType: 'text/html', body });
  });
  await context.route(/https:\/\/development\.api\.rave\.page\//, (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    const method = req.method();
    const json = (status: number, obj: unknown) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(obj) });

    if (method === 'GET' && path === '/auth/me') return json(200, { id: USER_ID, username: 'exampledj', display_name: 'Example DJ' });
    if (method === 'GET' && path === '/groups/mine') return json(200, [{ id: GROUP_ID, name: 'Example Club', can_organize_events: true }]);
    if (method === 'GET' && path === '/events/organizers') return json(200, []);
    if (method === 'POST' && path === '/events') {
      recorded.push({ method, path, body: req.postDataJSON() });
      return json(201, { id: EVENT_ID, status: 'draft', visibility: 'unlisted', is_public: false });
    }
    if (method === 'POST' && /^\/events\/[^/]+\/slots$/.test(path)) return json(201, { id: 'slt_1', slot_number: 1 });
    if (method === 'POST' && /^\/events\/[^/]+\/performers$/.test(path)) return json(201, { id: 'ep_1' });
    if (method === 'DELETE' && /^\/events\/[^/]+$/.test(path)) {
      recorded.push({ method, path, body: null });
      return route.fulfill({ status: 204, body: '' });
    }
    return json(404, { status: 'error', message: 'not found' });
  });
}

async function seedToken(page: Page): Promise<void> {
  const auth = {
    apiBase: API_BASE,
    token: 'seed-token',
    exp: new Date(Date.now() + 30 * 86_400_000).toISOString(),
    userId: USER_ID,
    label: 'Example DJ',
    obtainedAt: new Date().toISOString(),
  };
  await page.evaluate((a) => chrome.storage.local.set({ 'ravepage.auth': a }), auth);
}

test('Connect opens the bridge tab and the handshake reaches the consent card', async ({ context }) => {
  const recorded: Recorded[] = [];
  await mockRavepage(context, recorded);

  // Pre-open the bridge tab so Playwright serves the mock; ensureAgent reuses it.
  const bridge = await context.newPage();
  await bridge.goto(BRIDGE_URL);

  const dashboard = await openDashboard(context);
  await enableRavepage(dashboard); // dev panel is gated behind the experimental toggle
  // rave.page dev panel moved off the default route (now the Overview).
  await dashboard.evaluate(() => {
    location.hash = '#/dev/ravepage';
  });
  await dashboard.reload();
  await expect(dashboard.getByTestId('rp-status')).toContainText('Not connected');
  await dashboard.getByTestId('rp-connect').click(); // opens/injects the bridge agent

  // grantAwait posted hello -> the bridge renders its consent Connect button.
  await expect(bridge.getByTestId('bridge-connect')).toBeVisible({ timeout: 30_000 });
});

test('connected session: who-am-i, groups, create draft (recorded EventCreateIn), delete', async ({ context }) => {
  const recorded: Recorded[] = [];
  await mockRavepage(context, recorded);

  const dashboard = await openDashboard(context);
  await seedToken(dashboard);
  await enableRavepage(dashboard); // dev panel is gated behind the experimental toggle
  await dashboard.evaluate(() => {
    location.hash = '#/dev/ravepage';
  });
  await dashboard.reload();
  await expect(dashboard.getByTestId('rp-status')).toContainText('Connected', { timeout: 15_000 });
  await expect(dashboard.getByTestId('rp-status')).toContainText('Example DJ');

  await dashboard.getByTestId('rp-whoami').click();
  await expect(dashboard.getByTestId('rp-user')).toContainText(USER_ID, { timeout: 15_000 });

  await dashboard.getByTestId('rp-load-groups').click();
  await expect(dashboard.getByTestId('rp-group')).toHaveText(/Example Club/);

  await dashboard.getByTestId('rp-create').click();
  await expect(dashboard.getByTestId('rp-created-id')).toContainText(EVENT_ID, { timeout: 15_000 });

  const created = recorded.find((r) => r.method === 'POST' && r.path === '/events');
  expect(created, 'POST /events was recorded').toBeTruthy();
  expect(created?.body).toMatchObject({
    status: 'draft',
    visibility: 'unlisted',
    is_public: false,
    organizer_type: 'group',
    organizer_id: GROUP_ID,
  });
  expect((created?.body as { title: string }).title).toMatch(/^\[event-bridge test\] /);

  await dashboard.getByTestId('rp-delete').click();
  await expect(dashboard.getByTestId('rp-created-id')).toHaveCount(0, { timeout: 15_000 });
  expect(recorded.some((r) => r.method === 'DELETE' && r.path === `/events/${EVENT_ID}`)).toBe(true);
});
