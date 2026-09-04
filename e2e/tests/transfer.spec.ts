// Transfer e2e (mocks only): vrcpop "what's poppin" -> Transfer to vrc.tl. The
// Lineup-tab PerformerResolver auto-resolves the free-text "Example DJ" to the
// vrc.tl performer id, so the recorded vrc.tl write carries the ID, not the name.
// After the run a cross-platform link holds both refs and the row shows both cells.
import { expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder, type VrcpopRecorder } from '../mocks/vrcpop-api';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import type { Page } from '@playwright/test';

const T = 30_000;

async function pickClub(page: Page, platform: string, clubName: string): Promise<void> {
  await page.getByTestId(`editor-club-${platform}`).getByRole('button').first().click();
  await page.locator('[data-portal-surface="smart-select"]').getByRole('button', { name: clubName, exact: true }).click();
}

test('vrcpop -> vrc.tl transfer carries the resolved performer id, not the name', async ({ context }) => {
  const vp: VrcpopRecorder = newRecorder();
  const vt: RecordedRequest[] = [];
  await mockVrcpopSite(context, vp);
  await mockVrctlSite(context, vt);
  await openPlatformTab(context, 'vrcpop');
  await openPlatformTab(context, 'vrctl');
  const page = await openDashboard(context);

  // The Transfer button links here (edit the vrcpop source + a vrc.tl create target).
  await page.evaluate(() => { location.hash = '#/events/vrcpop/100001/edit?targets=vrctl'; });
  await page.reload();
  await expect(page.getByTestId('event-editor')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('editor-title')).toHaveValue("what's poppin", { timeout: T });

  await pickClub(page, 'vrctl', 'Example Club');

  // Lineup tab: the resolver auto-adopts the exact "Example DJ" match on vrc.tl.
  await page.getByTestId('editor-tab-lineup').click();
  await page.getByTestId('performer-resolver').waitFor({ state: 'attached', timeout: T });
  await expect(page.getByTestId('resolve-0-0')).toHaveCount(0, { timeout: T }); // resolved away

  // vrc.tl requires a content rating.
  await page.getByTestId('editor-tab-details').click();
  await page.getByTestId('editor-nsfw-sfw').click();

  // The vrc.tl preview now carries the performer id.
  await page.getByTestId('editor-tab-review').click();
  await expect.poll(async () => (await page.getByTestId('editor-preview-vrctl').textContent()) ?? '', { timeout: T }).toContain('300001');

  await expect(page.getByTestId('editor-run')).toBeEnabled({ timeout: T });
  await page.getByTestId('editor-run').click();

  // The vrc.tl detail (finalize) write carries the id, not the name.
  await expect.poll(() => vt.some((r) => r.method === 'POST' && r.path.startsWith('/admin/event/detail/')), { timeout: T }).toBe(true);
  const detail = vt.find((r) => r.method === 'POST' && r.path.startsWith('/admin/event/detail/'));
  expect(detail?.postData ?? '').toContain('300001');
  expect(detail?.postData ?? '').not.toContain('Example DJ');

  // One link holds both refs.
  await expect
    .poll(async () => {
      const s = await page.evaluate(() => chrome.storage.local.get('links'));
      const arr = (s.links as { refs: { platform: string; id: string }[] }[] | undefined) ?? [];
      const refs = arr[0]?.refs ?? [];
      return refs.map((r) => `${r.platform}:${r.id}`).sort().join(',');
    }, { timeout: T })
    .toBe('vrcpop:100001,vrctl:100002');

  // The unified row shows both platform cells.
  await page.evaluate(() => { location.hash = '#/events'; });
  await page.reload();
  await expect(page.getByTestId('events-table')).toBeVisible({ timeout: T });
  await expect(page.locator('[data-testid^="cell-vrcpop-"]').first()).toBeVisible({ timeout: T });
  await expect(page.locator('[data-testid^="cell-vrctl-"]').first()).toBeVisible({ timeout: T });
});
