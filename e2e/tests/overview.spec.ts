// Overview (default dashboard route) e2e against mocks only. Three equal cards
// in the fixed order vrc.tl, vrcpop.com, rave.page, each with a session-status
// badge. Mixed state: vrc.tl signed in, vrcpop signed out, rave.page not
// connected (no stored token — its status is token-store based, not a page tab).
import { enableRavepage, expect, mockPlatform, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder } from '../mocks/vrcpop-api';

const EXPECT_TIMEOUT = 25_000;

test('renders all three platform cards with per-platform status badges', async ({ context }) => {
  await mockPlatform(context, 'vrctl', 'logged-in');
  await openPlatformTab(context, 'vrctl');
  await mockPlatform(context, 'vrcpop', 'logged-out');
  await openPlatformTab(context, 'vrcpop');
  // rave.page: no connect gesture -> no stored token -> "Not connected".

  const dashboard = await openDashboard(context);
  await enableRavepage(dashboard); // experimental toggle on -> rave.page card appears
  await dashboard.reload();

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

// P6.1b bug fix: the vrcpop card date is a human label ("… at …") in the owner
// timezone; before the fix it went verbatim into OwnEvent.start -> Date.parse NaN
// -> the Overview upcoming count read 0 while #/events still listed the row. Now
// parseVrcpopCardDate yields an ISO instant, so the card counts it AND the table
// shows a real date. (rave.page toggle stays OFF here — vrcpop is unaffected by it.)
test('vrcpop upcoming card counts future events; #/events shows a real date', async ({ context }) => {
  await mockVrcpopSite(context, newRecorder()); // future 2030/2031 card labels
  await openPlatformTab(context, 'vrcpop');
  const dashboard = await openDashboard(context);

  // Overview card (default two-card build): non-zero upcoming count.
  await expect(dashboard.getByTestId('platform-upcoming-vrcpop')).toContainText('2', { timeout: EXPECT_TIMEOUT });

  // #/events renders a real, formatted date for the vrcpop row (not blank / label).
  await dashboard.evaluate(() => {
    location.hash = '#/events?time=all';
  });
  await dashboard.reload();
  await expect(dashboard.getByTestId('events-table')).toContainText("what's poppin", { timeout: EXPECT_TIMEOUT });
  await expect(dashboard.getByTestId('events-table')).toContainText('2030');
});
