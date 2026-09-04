// Multi-target e2e (vrc.tl + vrcpop, mocks only). One Run creates the event on both
// platforms and saves ONE link carrying both refs. Also verifies the editor renders
// at a 375x812 mobile viewport without horizontal overflow.
import { expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder, type VrcpopRecorder } from '../mocks/vrcpop-api';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import type { Page } from '@playwright/test';

const T = 30_000;

async function pickClub(page: Page, platform: string, clubName: string): Promise<void> {
  await page.getByTestId(`editor-club-${platform}`).getByRole('button').first().click();
  await page.locator('[data-portal-surface="smart-select"]').getByRole('button', { name: clubName, exact: true }).click();
}

test('vrc.tl + vrcpop: one run creates on both and saves a two-ref link', async ({ context }) => {
  const vt: RecordedRequest[] = [];
  const vp: VrcpopRecorder = newRecorder();
  await mockVrctlSite(context, vt);
  await mockVrcpopSite(context, vp);
  await openPlatformTab(context, 'vrctl');
  await openPlatformTab(context, 'vrcpop');
  const page = await openDashboard(context);

  await page.evaluate(() => {
    location.hash = '#/events/new';
  });
  await page.reload();
  await expect(page.getByTestId('event-editor')).toBeVisible({ timeout: T });

  await page.getByTestId('editor-target-vrctl').click();
  await page.getByTestId('editor-target-vrcpop').click();
  await pickClub(page, 'vrctl', 'Example Club');
  await pickClub(page, 'vrcpop', 'Example Club');
  await page.getByTestId('editor-title').fill('Cross Post Night');
  await page.getByTestId('editor-start').fill('2027-01-01T22:00');
  await page.getByTestId('editor-tab-details').click();
  await page.getByTestId('editor-nsfw-sfw').click(); // required for vrc.tl

  await page.getByTestId('editor-tab-review').click();
  await page.getByTestId('editor-run').click();

  await expect.poll(() => vp.createBodies.length, { timeout: T }).toBeGreaterThan(0);
  await expect
    .poll(() => vt.filter((r) => r.method === 'POST' && r.path === '/admin/event/create').length, { timeout: T })
    .toBeGreaterThan(0);
  expect(vp.createBodies[0]).toMatchObject({ event_name: 'Cross Post Night' });

  const links = await page.evaluate(() => chrome.storage.local.get('links'));
  const refs = (links.links as { refs: { platform: string; id: string }[] }[])[0]?.refs ?? [];
  expect(refs.map((r) => r.platform).sort()).toEqual(['vrcpop', 'vrctl']);
});

test('editor renders at 375x812 without horizontal overflow', async ({ context }) => {
  const vt: RecordedRequest[] = [];
  await mockVrctlSite(context, vt);
  await openPlatformTab(context, 'vrctl');
  const page = await openDashboard(context);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => {
    location.hash = '#/events/new';
  });
  await page.reload();
  await expect(page.getByTestId('event-editor')).toBeVisible({ timeout: T });
  await page.getByTestId('editor-target-vrctl').click();

  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    return d.scrollWidth > d.clientWidth || document.body.scrollWidth > document.body.clientWidth;
  });
  expect(overflow).toBe(false);
});
