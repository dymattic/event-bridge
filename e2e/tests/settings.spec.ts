// #/settings e2e (mocks only). The experimental rave.page toggle is OFF by
// default: the default build shows exactly two platform cards and hides rave.page
// everywhere; turning the Settings switch on surfaces the third card without a
// page reload; #/events lists rave.page only while enabled; rave.page-only routes
// show an off-state when disabled.
import { enableRavepage, expect, openDashboard, test } from '../fixtures/extension';
import { mockRavepageEvents, newRavepageRecorder, seedRavepageToken } from '../mocks/ravepage-events';

const T = 30_000;

const cardIds = (page: import('@playwright/test').Page): Promise<(string | null)[]> =>
  page.locator('[data-testid^="platform-card-"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')));

test('default build shows exactly two platform cards, no rave.page', async ({ context }) => {
  const dashboard = await openDashboard(context);
  await expect(dashboard.getByTestId('platform-card-vrctl')).toBeVisible({ timeout: T });
  expect(await cardIds(dashboard)).toEqual(['platform-card-vrctl', 'platform-card-vrcpop']);
  await expect(dashboard.getByTestId('platform-card-ravepage')).toHaveCount(0);
});

test('enabling via the Settings switch shows three cards without a page reload', async ({ context }) => {
  const dashboard = await openDashboard(context);
  await expect(dashboard.getByTestId('platform-card-vrctl')).toBeVisible({ timeout: T });
  expect(await cardIds(dashboard)).toHaveLength(2);

  // Navigate to Settings (hash nav, no reload) and flip the toggle on.
  await dashboard.getByTestId('topnav-settings').click();
  await expect(dashboard.getByTestId('settings-view')).toBeVisible({ timeout: T });
  await expect(dashboard.getByTestId('settings-ravepage-instance')).toHaveCount(0); // hidden while off
  await dashboard.getByTestId('settings-ravepage-toggle').click();
  await expect(dashboard.getByTestId('settings-ravepage-instance')).toBeVisible({ timeout: T }); // shows on

  // Back to Overview (hash nav) — three cards now, no reload.
  await dashboard.getByTestId('topnav-overview').click();
  await expect(dashboard.getByTestId('platform-card-ravepage')).toBeVisible({ timeout: T });
  expect(await cardIds(dashboard)).toEqual(['platform-card-vrctl', 'platform-card-vrcpop', 'platform-card-ravepage']);
});

test('#/events lists rave.page only when the toggle is on', async ({ context }) => {
  await mockRavepageEvents(context, newRavepageRecorder());
  const page = await openDashboard(context);
  await seedRavepageToken(page);
  await enableRavepage(page);
  await page.evaluate(() => {
    location.hash = '#/events?time=all';
  });
  await page.reload();
  await expect(page.getByTestId('events-table')).toContainText('Neon Cathedral', { timeout: T });

  // Disable -> rave.page disconnected + gated; nothing else connected -> empty state,
  // and the connect list offers only the two enabled platforms.
  await page.evaluate(() => chrome.storage.local.set({ settings: { experimental: { ravepage: false } } }));
  await page.reload();
  await expect(page.getByTestId('events-none-connected')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('events-connect-ravepage')).toHaveCount(0);
  await expect(page.getByTestId('events-connect-vrctl')).toBeVisible();
});

test('rave.page-only routes show an off-state while disabled', async ({ context }) => {
  const page = await openDashboard(context);
  await page.evaluate(() => {
    location.hash = '#/events/ravepage/evt_x';
  });
  await page.reload();
  await expect(page.getByTestId('ravepage-off')).toBeVisible({ timeout: T });

  await page.evaluate(() => {
    location.hash = '#/dev/ravepage';
  });
  await expect(page.getByTestId('ravepage-off')).toBeVisible({ timeout: T });
});
