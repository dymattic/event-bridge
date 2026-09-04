// #/events e2e against mocks only (never the real platforms). All three platforms
// return >=1 own club + 2 own events; the table shows resolved titles + club names
// with NO raw ids, filters/search narrow rows, the mobile viewport renders cards,
// and delete shows the exact planned request + sends it (recorded on the mock).
import { enableRavepage, expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder, type VrcpopRecorder } from '../mocks/vrcpop-api';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import { mockRavepageEvents, newRavepageRecorder, seedRavepageToken, type RavepageRecorder } from '../mocks/ravepage-events';
import type { BrowserContext, Page } from '@playwright/test';

const T = 30_000;
const RAW_ID = /^(grp_|evt_|usr_)|^user \d+$/;

async function setupAll(context: BrowserContext): Promise<{ page: Page; vp: VrcpopRecorder; vt: RecordedRequest[]; rp: RavepageRecorder }> {
  const vp = newRecorder();
  const vt: RecordedRequest[] = [];
  const rp = newRavepageRecorder();
  await mockVrcpopSite(context, vp);
  await mockVrctlSite(context, vt);
  await mockRavepageEvents(context, rp);
  await openPlatformTab(context, 'vrcpop');
  await openPlatformTab(context, 'vrctl');
  const page = await openDashboard(context);
  await seedRavepageToken(page);
  await enableRavepage(page); // rave.page is an equal integration here only with the toggle on
  await page.evaluate(() => {
    location.hash = '#/events?time=all';
  });
  await page.reload();
  await expect(page.getByTestId('events-table')).toBeVisible({ timeout: T });
  return { page, vp, vt, rp };
}

test('lists own events for all three platforms, no raw ids, filters + search narrow', async ({ context }) => {
  const { page } = await setupAll(context);
  const table = page.getByTestId('events-table');

  // resolved titles + club names for every platform
  await expect(table).toContainText("what's poppin", { timeout: T }); // vrcpop + vrctl
  await expect(table).toContainText('just spinnin', { timeout: T }); // vrctl
  await expect(table).toContainText('Neon Cathedral', { timeout: T }); // rave.page
  await expect(table).toContainText('Example Club'); // vrcpop/vrctl club
  await expect(table).toContainText('Neon Collective'); // rave.page club

  // no raw id is a cell's primary text
  const leaked = await page
    .locator('[data-testid="events-table"] td')
    .evaluateAll((tds, re) => tds.map((td) => (td.textContent ?? '').trim()).filter((t) => new RegExp(re).test(t)), RAW_ID.source);
  expect(leaked).toEqual([]);

  // platform filter (URL-synced) narrows to one platform
  await page.evaluate(() => {
    location.hash = '#/events?time=all&platform=ravepage';
  });
  await expect(table).toContainText('Neon Cathedral', { timeout: T });
  await expect(table).not.toContainText("what's poppin");

  // search narrows by title
  await page.evaluate(() => {
    location.hash = '#/events?time=all';
  });
  await expect(table).toContainText('Neon Cathedral', { timeout: T });
  await page.getByTestId('events-search').fill('poppin');
  await expect(table).toContainText("what's poppin", { timeout: T });
  await expect(table).not.toContainText('Neon Cathedral');

  // mobile viewport renders cards, not the table rows (one logical row per event;
  // unlinked, so the vrcpop copy is its own row keyed vrcpop:100001)
  await page.evaluate(() => {
    location.hash = '#/events?time=all';
  });
  await page.setViewportSize({ width: 360, height: 780 });
  await expect(page.getByTestId('event-card-vrcpop:100001')).toBeVisible({ timeout: T });
});

test('delete (on the event detail view) shows the exact planned request and sends it', async ({ context }) => {
  const { page, vp } = await setupAll(context);

  // Per-cell delete lives on the platform's detail view (this unit's choice).
  await page.evaluate(() => {
    location.hash = '#/events/vrcpop/100001';
  });
  await expect(page.getByTestId('event-detail')).toBeVisible({ timeout: T });
  await page.getByTestId('event-detail-delete').click();
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: T });

  // destructive copy names the platform for a published event
  await expect(page.getByRole('dialog')).toContainText('vrcpop.com');

  // the exact planned request is previewable before confirming
  await page.getByTestId('delete-preview-disclosure').locator('summary').click();
  const preview = page.getByTestId('delete-preview');
  await expect(preview).toContainText('vrcpop:delete');
  await expect(preview).toContainText('100001');

  // confirm -> the adapter's planned delete request is sent
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
  await expect.poll(() => vp.deleteBodies.length, { timeout: T }).toBeGreaterThan(0);
  expect(vp.deleteBodies.at(-1)).toMatchObject({ event_id: 100001 });
});
