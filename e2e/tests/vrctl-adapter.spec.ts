// vrc.tl adapter e2e. Drives the real transport (the agent `http` op inside a
// mocked vrc.tl tab) through the popup's window.__eventBridgeRuntime surface,
// building every request with the adapter's own pure route/encoder code so the
// mock records exactly what production would send. NEVER hits the real site.
//
// The parser/planner assertions (parse slots/flags, plan/preview, VALIDATION UI)
// are covered by the unit suite (happy-dom). The dev-panel-driven variant is
// skipped below with the one-line wiring the lead adds in P6.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, openPlatformTab, openPopup, test } from '../fixtures/extension';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import type { HttpRequest, HttpResult } from '../../src/shared/agent-protocol';
import type { VrctlDetailForm } from '../../src/core/mapping/vrctl-types';
import { buildRequest } from '../../src/adapters/vrctl/routes';
import { asCategoryId, asDeleteAction, asEventId, asOrganizerId } from '../../src/adapters/vrctl/ids';
import { buildMultipartBody, encodeUrlencoded, toMultipartFields } from '../../src/adapters/vrctl/forms';
import { buildVrctlCreateFields, buildVrctlDetailFields } from '../../src/core/mapping/to-vrctl';
import { fromVrctl } from '../../src/core/mapping/from-vrctl';
import { planCreate } from '../../src/adapters/vrctl/planner';
import { isSignInRedirect } from '../../src/adapters/vrctl/parse';

const here = dirname(fileURLToPath(import.meta.url));
const detailJson = resolve(here, '..', '..', 'test', 'fixtures', 'vrctl', 'detail-form.json');
const form = JSON.parse(readFileSync(detailJson, 'utf8')) as VrctlDetailForm;
const core = fromVrctl(form, { organizerName: 'Example Club' });

// Detail field names guaranteed present for this core (no poster/openDecks/etc).
const EXPECT_DETAIL = [
  'organizers[]', 'name', 'description', 'instanceOpenMinutesBeforeStart', 'start', 'timezone', 'url',
  'howToJoin', 'showSlots', 'slots[136569][duration]', 'slots[136569][flag]', 'slots[136569][performers][]',
  'flags[1]', 'flags[2][]', '_submit', '_do',
];

interface Runtime {
  ensureAgent: (p: string, o: { allowOpen: boolean }) => Promise<{ tabId: number }>;
  callAgent: (tabId: number, op: { op: 'http'; request: HttpRequest }) => Promise<HttpResult>;
}

test('reads own surfaces + records exact create/detail/delete requests via the agent', async ({ context }) => {
  const rec: RecordedRequest[] = [];
  await mockVrctlSite(context, rec);
  await openPlatformTab(context, 'vrctl');
  const popup = await openPopup(context);

  const createFields = buildVrctlCreateFields(core, { organizerId: '9001', categoryId: '1' });
  const detailFields = buildVrctlDetailFields(core, form, { publish: false });
  const detailBody = await buildMultipartBody(toMultipartFields(detailFields), async () => 'noblob');
  const deleteAction = asDeleteAction('/admin/event?grid-grid-__id=100002&grid-grid-__key=delete&do=grid-grid-actionCallback');

  const reqs: Record<string, HttpRequest> = {
    chooseOrganizer: buildRequest('chooseOrganizer', {}),
    grid: buildRequest('grid', {}),
    detail: buildRequest('detail', { eventId: asEventId('100002') }),
    performer: buildRequest('performerSearch', { term: 'Example' }),
    create: buildRequest('create', { organizerId: asOrganizerId('9001'), categoryId: asCategoryId('1'), promoted: false, body: encodeUrlencoded(createFields) }),
    detailSubmit: buildRequest('detailSubmit', { eventId: asEventId('100002'), body: detailBody }),
    del: buildRequest('delete', { action: deleteAction }),
  };

  const results = await popup.evaluate(async (payload: Record<string, HttpRequest>) => {
    const r = (window as unknown as { __eventBridgeRuntime: Runtime }).__eventBridgeRuntime;
    const { tabId } = await r.ensureAgent('vrctl', { allowOpen: false });
    const out: Record<string, HttpResult> = {};
    for (const [k, request] of Object.entries(payload)) out[k] = await r.callAgent(tabId, { op: 'http', request });
    return out;
  }, reqs);

  // ---- reads ----
  expect(results.chooseOrganizer?.body ?? '').toContain('Example Club');
  expect(results.grid?.body ?? '').toContain("what's poppin");
  expect(results.detail?.body ?? '').toContain('slots[136569]');
  const perf = JSON.parse(results.performer?.body ?? '{}') as { results: { text: string }[] };
  expect(perf.results[0]?.text).toBe('Example DJ');

  // ---- create: the new detail id is surfaced via the Location header ----
  // (real site 303->follow->finalUrl; mock 200+Location — same adapter code path)
  expect(results.create?.headers?.location ?? '').toContain('/admin/event/detail/100002');
  const createReq = rec.find((r) => r.method === 'POST' && r.path === '/admin/event/create');
  expect(createReq).toBeTruthy();
  const sentCreate = [...new URLSearchParams(createReq?.postData ?? '')].map(([k, v]) => [k, v] as [string, string]);
  expect(sentCreate).toEqual(createFields); // previewed create field list == recorded urlencoded body

  // ---- detail POST: multipart field names cover the expected set; published absent ----
  const submitReq = rec.find((r) => r.method === 'POST' && r.path.startsWith('/admin/event/detail/'));
  expect(submitReq?.contentType ?? '').toContain('multipart/form-data');
  const names = [...(submitReq?.postData ?? '').matchAll(/name="([^"]+)"/g)].map((m) => m[1]);
  for (const n of EXPECT_DETAIL) expect(names, `missing ${n}`).toContain(n);
  expect(names).not.toContain('published');

  // ---- delete: exact grid action URL recorded ----
  const delReq = rec.find((r) => r.path === '/admin/event' && r.search.includes('grid-grid-__key=delete'));
  expect(`${delReq?.path}${delReq?.search}`).toBe('/admin/event?grid-grid-__id=100002&grid-grid-__key=delete&do=grid-grid-actionCallback');
  expect(results.del?.status).toBe(200);
  expect(results.del?.finalUrl ?? '').toContain('/admin/event');
});

test('NSFW/SFW missing -> VALIDATION before any request', () => {
  // Pure planner refuses up-front; no request is issued.
  expect(() => planCreate({ ...core, flags: {} }, { organizerId: asOrganizerId('9001') })).toThrow(/nsfw/i);
});

test('logged out: an /admin GET follows to sign-in (NOT_LOGGED_IN signal)', async ({ context }) => {
  const rec: RecordedRequest[] = [];
  await mockVrctlSite(context, rec, { loggedIn: false });
  await openPlatformTab(context, 'vrctl'); // bounces to /sign/in
  const popup = await openPopup(context);
  const res = await popup.evaluate(async () => {
    const r = (window as unknown as { __eventBridgeRuntime: Runtime }).__eventBridgeRuntime;
    const { tabId } = await r.ensureAgent('vrctl', { allowOpen: false });
    return r.callAgent(tabId, { op: 'http', request: { method: 'GET', path: '/admin/event', redirect: 'follow', responseType: 'text' } });
  });
  // Mock serves the sign-in page directly (no browser redirect); the adapter
  // detects logged-out from the sign-in body marker.
  expect(res.body ?? '').toContain('/sign/in');
  expect(isSignInRedirect(res)).toBe(true);
});

// The full dev-panel-driven flow (in-page parse of slots/flags, create preview
// shown in the UI, VALIDATION surfaced before any request) needs the panel bundled
// into a built page. App.tsx is owned by the lead; wire it in P6 with:
//   import { VrctlDevPanel } from './dev/VrctlDevPanel';  // then render <VrctlDevPanel />
// (or mount standalone via src/ui/dashboard/dev/vrctl-dev-entry.ts mountVrctlDevPanel).
test.skip('dev-panel: organizers -> grid -> detail parse -> preview == body (needs App.tsx wiring)', () => {
  // Covered at the unit level (test/adapters/vrctl/*). Unskip after P6 wiring.
});
