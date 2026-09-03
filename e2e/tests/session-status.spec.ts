import { expect, mockPlatform, openPlatformTab, openPopup, test, type MockPlatform } from '../fixtures/extension';

// P3 changed rave.page: its status derives from the extension token store (a
// connect gesture), NOT from a page session — no tab is opened and the SPA's
// localStorage login is ignored. With no stored token it is always "Logged out"
// here. The tab-session platforms (vrcpop, vrc.tl) keep the P2 behaviour.
const TAB_PLATFORMS: MockPlatform[] = ['vrcpop', 'vrctl'];
const PLATFORMS: MockPlatform[] = ['vrcpop', 'vrctl', 'ravepage'];
const EXPECT_TIMEOUT = 25_000;

test('no platform tabs open -> "No tab open" for tab platforms, "Logged out" for rave.page', async ({ context }) => {
  const popup = await openPopup(context);
  for (const p of TAB_PLATFORMS) {
    await expect(popup.getByTestId(`status-${p}`)).toContainText('No tab open', { timeout: EXPECT_TIMEOUT });
  }
  await expect(popup.getByTestId('status-ravepage')).toContainText('Logged out', { timeout: EXPECT_TIMEOUT });
});

test('logged-in mocked tabs -> Logged in for tab platforms; rave.page stays Logged out (no stored token)', async ({ context }) => {
  for (const p of PLATFORMS) {
    await mockPlatform(context, p, 'logged-in');
    await openPlatformTab(context, p);
  }
  const popup = await openPopup(context);
  for (const p of TAB_PLATFORMS) {
    await expect(popup.getByTestId(`status-${p}`)).toContainText('Logged in', { timeout: EXPECT_TIMEOUT });
  }
  await expect(popup.getByTestId('status-ravepage')).toContainText('Logged out', { timeout: EXPECT_TIMEOUT });
});

test('logged-out mocked tabs -> popup shows Logged out for all three', async ({ context }) => {
  for (const p of PLATFORMS) {
    await mockPlatform(context, p, 'logged-out');
    await openPlatformTab(context, p);
  }
  const popup = await openPopup(context);
  for (const p of PLATFORMS) {
    await expect(popup.getByTestId(`status-${p}`)).toContainText('Logged out', { timeout: EXPECT_TIMEOUT });
  }
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
