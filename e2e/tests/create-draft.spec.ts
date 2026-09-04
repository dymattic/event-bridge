// Create-draft e2e (mocks only; never the real platforms). One test per platform:
// open #/events/new, tick the target, pick the club by NAME, fill Basics (+ NSFW
// where required), add a lineup slot with a searched performer, confirm Review
// shows the exact request, Run, then assert the mock recorded the previewed body,
// a cross-platform link was saved, and the new event's detail route opened.
import { enableRavepage, expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder, GROUP_ID, type VrcpopRecorder } from '../mocks/vrcpop-api';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import { mockRavepageEvents, newRavepageRecorder, RP_NEW_EVENT, seedRavepageToken, type RavepageRecorder } from '../mocks/ravepage-events';
import type { Page } from '@playwright/test';

const T = 30_000;

// Extract one plan step's JSON body from the Review preview (`<label> [p:kind]\n<json>`).
function stepJson(preview: string, tag: string): Record<string, unknown> {
  const block = preview.split('\n\n').find((b) => b.includes(tag)) ?? '';
  return JSON.parse(block.slice(block.indexOf('\n') + 1)) as Record<string, unknown>;
}

async function pickClub(page: Page, platform: string, clubName: string): Promise<void> {
  await page.getByTestId(`editor-club-${platform}`).getByRole('button').first().click();
  await page.locator('[data-portal-surface="smart-select"]').getByRole('button', { name: clubName, exact: true }).click();
}

async function addSlotWithPerformer(page: Page): Promise<void> {
  await page.getByTestId('editor-tab-lineup').click();
  await page.getByRole('button', { name: 'Add slot' }).first().click();
  await page.getByTestId('lineup-slot-0').getByLabel('Add performer').click();
  await page.getByRole('button', { name: /Search performers/ }).click();
  await page.getByPlaceholder(/Search performers/).fill('Example');
  const option = page.locator('[data-portal-surface="smart-select"]').getByRole('button', { name: /Example DJ/ }).first();
  await expect(option).toBeVisible({ timeout: T });
  await option.click();
}

async function openNew(page: Page): Promise<void> {
  await page.evaluate(() => {
    location.hash = '#/events/new';
  });
  await page.reload();
  await expect(page.getByTestId('event-editor')).toBeVisible({ timeout: T });
}

test('vrc.tl: create a draft (previewed request == recorded, link saved, detail route opened)', async ({ context }) => {
  const rec: RecordedRequest[] = [];
  await mockVrctlSite(context, rec);
  await openPlatformTab(context, 'vrctl');
  const page = await openDashboard(context);
  await openNew(page);

  await page.getByTestId('editor-target-vrctl').click();
  await pickClub(page, 'vrctl', 'Example Club');
  await page.getByTestId('editor-title').fill('Warehouse Night');
  await page.getByTestId('editor-start').fill('2027-01-01T22:00');
  await page.getByTestId('editor-tab-details').click();
  await page.getByTestId('editor-nsfw-sfw').click();
  await addSlotWithPerformer(page);

  await page.getByTestId('editor-tab-review').click();
  const preview = (await page.getByTestId('editor-preview-vrctl').textContent()) ?? '';
  expect(preview).toContain('Warehouse Night');
  const create = stepJson(preview, '[vrctl:create]');
  const fields = create.fields as [string, string][];

  await page.getByTestId('editor-run').click();

  await expect
    .poll(() => rec.filter((r) => r.method === 'POST' && r.path === '/admin/event/create').length, { timeout: T })
    .toBeGreaterThan(0);
  const createReq = rec.find((r) => r.method === 'POST' && r.path === '/admin/event/create');
  const sent = [...new URLSearchParams(createReq?.postData ?? '')].map(([k, v]) => [k, v] as [string, string]);
  expect(sent).toEqual(fields); // recorded urlencoded body == previewed create fields
  await expect
    .poll(() => rec.some((r) => r.method === 'POST' && r.path.startsWith('/admin/event/detail/')), { timeout: T })
    .toBe(true); // the finalize (detail) POST followed

  await expect.poll(() => page.evaluate(() => location.hash), { timeout: T }).toBe('#/events/vrctl/100002');
  const links = await page.evaluate(() => chrome.storage.local.get('links'));
  expect((links.links as { refs: { platform: string; id: string }[] }[])[0]?.refs).toEqual([{ platform: 'vrctl', id: '100002' }]);
});

test('vrcpop: create a draft (previewed body == recorded, link saved, detail route opened)', async ({ context }) => {
  const rec: VrcpopRecorder = newRecorder();
  await mockVrcpopSite(context, rec);
  await openPlatformTab(context, 'vrcpop');
  const page = await openDashboard(context);
  await openNew(page);

  await page.getByTestId('editor-target-vrcpop').click();
  await pickClub(page, 'vrcpop', 'Example Club');
  await page.getByTestId('editor-title').fill('Basement Session');
  await page.getByTestId('editor-start').fill('2027-01-01T22:00');
  await addSlotWithPerformer(page);

  await page.getByTestId('editor-tab-review').click();
  const preview = (await page.getByTestId('editor-preview-vrcpop').textContent()) ?? '';
  const previewBody = stepJson(preview, '[vrcpop:create]').body as Record<string, unknown>;
  expect(previewBody.event_name).toBe('Basement Session');

  await page.getByTestId('editor-run').click();

  await expect.poll(() => rec.createBodies.length, { timeout: T }).toBeGreaterThan(0);
  expect(rec.createBodies[0]).toEqual(previewBody); // recorded JSON == previewed request body
  expect(rec.createBodies[0]).toMatchObject({ group_id: GROUP_ID, status: 'draft' });

  await expect.poll(() => page.evaluate(() => location.hash), { timeout: T }).toBe('#/events/vrcpop/100010');
  const links = await page.evaluate(() => chrome.storage.local.get('links'));
  expect((links.links as { refs: { platform: string; id: string }[] }[])[0]?.refs).toEqual([{ platform: 'vrcpop', id: '100010' }]);
});

test('rave.page: create a draft (previewed body == recorded, link saved, detail route opened)', async ({ context }) => {
  const rec: RavepageRecorder = newRavepageRecorder();
  await mockRavepageEvents(context, rec);
  const page = await openDashboard(context);
  await seedRavepageToken(page);
  await enableRavepage(page);
  await openNew(page);

  await page.getByTestId('editor-target-ravepage').click();
  await pickClub(page, 'ravepage', 'Neon Collective');
  await page.getByTestId('editor-title').fill('Cathedral Draft');
  await page.getByTestId('editor-start').fill('2027-01-01T22:00');
  await addSlotWithPerformer(page);

  await page.getByTestId('editor-tab-review').click();
  const preview = (await page.getByTestId('editor-preview-ravepage').textContent()) ?? '';
  const createBody = stepJson(preview, '[ravepage:create]');
  expect(createBody.title).toBe('Cathedral Draft');

  await page.getByTestId('editor-run').click();

  await expect.poll(() => rec.created.length, { timeout: T }).toBeGreaterThan(0);
  await expect.poll(() => rec.slots.length, { timeout: T }).toBeGreaterThan(0); // the lineup slot was created
  await expect.poll(() => rec.performers.length, { timeout: T }).toBeGreaterThan(0); // the searched performer was added
  expect(rec.created[0]).toEqual(createBody); // recorded JSON == previewed create body
  expect(rec.created[0]).toMatchObject({ organizer_id: 'grp_00000000-0000-4000-8000-000000009001', is_public: false });

  await expect.poll(() => page.evaluate(() => location.hash), { timeout: T }).toBe(`#/events/ravepage/${RP_NEW_EVENT}`);
  const links = await page.evaluate(() => chrome.storage.local.get('links'));
  expect((links.links as { refs: { platform: string; id: string }[] }[])[0]?.refs).toEqual([{ platform: 'ravepage', id: RP_NEW_EVENT }]);
});
