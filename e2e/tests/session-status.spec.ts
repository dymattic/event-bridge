import { enableRavepage, expect, mockPlatform, openPlatformTab, openPopup, test, type MockPlatform } from '../fixtures/extension';

// rave.page is an experimental integration, OFF by default: its popup row is
// hidden entirely until the toggle is on. When on, its status derives from the
// extension token store (a connect gesture), NOT a page session — the SPA's
// localStorage login is ignored, so with no stored token it reads "Not connected".
// The tab-session platforms (vrcpop, vrc.tl) always show and speak "Signed in /
// Signed out".
const TAB_PLATFORMS: MockPlatform[] = ['vrcpop', 'vrctl'];
const PLATFORMS: MockPlatform[] = ['vrcpop', 'vrctl', 'ravepage'];
const EXPECT_TIMEOUT = 25_000;

test('default popup: two tab rows, rave.page hidden; enabling shows it "Not connected"', async ({ context }) => {
  const popup = await openPopup(context);
  for (const p of TAB_PLATFORMS) {
    await expect(popup.getByTestId(`status-${p}`)).toContainText('No tab open', { timeout: EXPECT_TIMEOUT });
  }
  // Off by default -> no rave.page row at all.
  await expect(popup.getByTestId('status-ravepage')).toHaveCount(0);
  // Enable -> the row appears and reads "Not connected" (no stored token).
  await enableRavepage(popup);
  await popup.reload();
  await expect(popup.getByTestId('status-ravepage')).toContainText('Not connected', { timeout: EXPECT_TIMEOUT });
});

test('logged-in mocked tabs -> Signed in for tab platforms; rave.page (enabled) stays Not connected', async ({ context }) => {
  for (const p of PLATFORMS) {
    await mockPlatform(context, p, 'logged-in');
    await openPlatformTab(context, p);
  }
  const popup = await openPopup(context);
  for (const p of TAB_PLATFORMS) {
    await expect(popup.getByTestId(`status-${p}`)).toContainText('Signed in', { timeout: EXPECT_TIMEOUT });
  }
  await enableRavepage(popup);
  await popup.reload();
  // No stored token + SPA localStorage ignored -> Not connected even with a live tab.
  await expect(popup.getByTestId('status-ravepage')).toContainText('Not connected', { timeout: EXPECT_TIMEOUT });
});

test('logged-out mocked tabs -> Signed out for tab platforms; rave.page (enabled) Not connected', async ({ context }) => {
  for (const p of PLATFORMS) {
    await mockPlatform(context, p, 'logged-out');
    await openPlatformTab(context, p);
  }
  const popup = await openPopup(context);
  for (const p of TAB_PLATFORMS) {
    await expect(popup.getByTestId(`status-${p}`)).toContainText('Signed out', { timeout: EXPECT_TIMEOUT });
  }
  await enableRavepage(popup);
  await popup.reload();
  await expect(popup.getByTestId('status-ravepage')).toContainText('Not connected', { timeout: EXPECT_TIMEOUT });
});

// Probe: does tabs.query({url}) surface the tab + its URL with host permission
// only (manifest has no "tabs" permission)? If url comes back undefined, add
// "tabs" to manifest/base.json.
test('tabs.query finds the mocked vrcpop tab and its URL without the "tabs" permission', async ({ context }) => {
  await mockPlatform(context, 'vrcpop', 'logged-in');
  await openPlatformTab(context, 'vrcpop');
  const popup = await openPopup(context);
  const found = await popup.evaluate(async () => {
    const rt = (window as unknown as { __eventBridgeRuntime: { queryPlatformTabs: (p: string) => Promise<{ tabId?: number; url?: string }[]> } }).__eventBridgeRuntime;
    return rt.queryPlatformTabs('vrcpop');
  });
  expect(found.length).toBeGreaterThan(0);
  expect(found[0]?.url ?? '').toContain('vrcpop.com');
});
