// Overview (default dashboard route) e2e against mocks only. Three equal cards
// in the fixed order vrc.tl, vrcpop.com, rave.page, each with a session-status
// badge. Mixed state: vrc.tl signed in, vrcpop signed out, rave.page not
// connected (no stored token — its status is token-store based, not a page tab).
import { expect, mockPlatform, openDashboard, openPlatformTab, test } from '../fixtures/extension';

const EXPECT_TIMEOUT = 25_000;

test('renders all three platform cards with per-platform status badges', async ({ context }) => {
  await mockPlatform(context, 'vrctl', 'logged-in');
  await openPlatformTab(context, 'vrctl');
  await mockPlatform(context, 'vrcpop', 'logged-out');
  await openPlatformTab(context, 'vrcpop');
  // rave.page: no connect gesture -> no stored token -> "Not connected".

  const dashboard = await openDashboard(context);

  // All three cards present, in the fixed order.
  const cardIds = await dashboard
    .locator('[data-testid^="platform-card-"]')
    .evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')));
  expect(cardIds).toEqual(['platform-card-vrctl', 'platform-card-vrcpop', 'platform-card-ravepage']);

  await expect(dashboard.getByTestId('platform-status-vrctl')).toContainText('Signed in', { timeout: EXPECT_TIMEOUT });
  await expect(dashboard.getByTestId('platform-status-vrcpop')).toContainText('Signed out', { timeout: EXPECT_TIMEOUT });
  await expect(dashboard.getByTestId('platform-status-ravepage')).toContainText('Not connected', { timeout: EXPECT_TIMEOUT });

  // Actions present for each platform.
  await expect(dashboard.getByTestId('platform-open-vrctl')).toBeVisible();
  await expect(dashboard.getByTestId('platform-open-vrcpop')).toBeVisible();
  await expect(dashboard.getByTestId('platform-connect-ravepage')).toBeVisible();
});
