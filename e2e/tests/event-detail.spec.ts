// #/events/:platform/:id e2e — the read-only detail renders the resolved lineup
// (performer NAMES, not ids) for each platform, against mocks only.
import { enableRavepage, expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder } from '../mocks/vrcpop-api';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import { mockRavepageEvents, newRavepageRecorder, seedRavepageToken, RP_EVENT_1 } from '../mocks/ravepage-events';
import type { BrowserContext, Page } from '@playwright/test';

const T = 30_000;

async function setup(context: BrowserContext): Promise<Page> {
  await mockVrcpopSite(context, newRecorder());
  const vt: RecordedRequest[] = [];
  await mockVrctlSite(context, vt);
  await mockRavepageEvents(context, newRavepageRecorder());
  await openPlatformTab(context, 'vrcpop');
  await openPlatformTab(context, 'vrctl');
  const page = await openDashboard(context);
  await seedRavepageToken(page);
  await enableRavepage(page); // rave.page detail route requires the toggle on
  return page;
}

async function openDetail(page: Page, hash: string): Promise<void> {
  await page.evaluate((h) => {
    location.hash = h;
  }, hash);
  await page.reload();
  await expect(page.getByTestId('event-detail')).toBeVisible({ timeout: T });
}

test('vrcpop detail renders the resolved lineup performer names', async ({ context }) => {
  const page = await setup(context);
  await openDetail(page, '#/events/vrcpop/100001');
  await expect(page.getByTestId('event-detail-title')).toContainText("what's poppin", { timeout: T });
  await expect(page.getByTestId('event-detail-lineup')).toContainText('Example DJ', { timeout: T });
});

test('vrctl detail renders the resolved lineup performer names', async ({ context }) => {
  const page = await setup(context);
  await openDetail(page, '#/events/vrctl/100002');
  await expect(page.getByTestId('event-detail-lineup')).toContainText('Example DJ', { timeout: T });
});

test('rave.page detail renders the resolved lineup performer names', async ({ context }) => {
  const page = await setup(context);
  await openDetail(page, `#/events/ravepage/${RP_EVENT_1}`);
  await expect(page.getByTestId('event-detail-title')).toContainText('Neon Cathedral', { timeout: T });
  await expect(page.getByTestId('event-detail-lineup')).toContainText('Aurora', { timeout: T });
});
