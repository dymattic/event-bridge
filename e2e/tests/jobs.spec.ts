// Jobs log e2e (mocks only). Create a vrcpop draft through the editor, then open
// #/jobs and confirm the run is recorded as a done 'create' job with a step whose
// preview shows the exact resolved request (never tokens).
import { expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder, type VrcpopRecorder } from '../mocks/vrcpop-api';
import type { Page } from '@playwright/test';

const T = 30_000;

async function pickClub(page: Page, platform: string, clubName: string): Promise<void> {
  await page.getByTestId(`editor-club-${platform}`).getByRole('button').first().click();
  await page.locator('[data-portal-surface="smart-select"]').getByRole('button', { name: clubName, exact: true }).click();
}

test('a create run is recorded in #/jobs as done with a step preview', async ({ context }) => {
  const rec: VrcpopRecorder = newRecorder();
  await mockVrcpopSite(context, rec);
  await openPlatformTab(context, 'vrcpop');
  const page = await openDashboard(context);

  await page.evaluate(() => { location.hash = '#/events/new'; });
  await page.reload();
  await expect(page.getByTestId('event-editor')).toBeVisible({ timeout: T });

  await page.getByTestId('editor-target-vrcpop').click();
  await pickClub(page, 'vrcpop', 'Example Club');
  await page.getByTestId('editor-title').fill('Job Log Night');
  await page.getByTestId('editor-start').fill('2030-02-01T22:00');
  await page.getByTestId('editor-tab-review').click();
  await page.getByTestId('editor-run').click();

  await expect.poll(() => rec.createBodies.length, { timeout: T }).toBeGreaterThan(0);

  // Open the job log.
  await page.evaluate(() => { location.hash = '#/jobs'; });
  await expect(page.getByTestId('jobs-view')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('jobs-table')).toBeVisible({ timeout: T });
  const view = page.getByTestId('jobs-view');
  await expect(view).toContainText('Job Log Night', { timeout: T });
  await expect(view).toContainText('create');
  await expect(view).toContainText('done');
  // The step preview shows the resolved request body (event_name), no tokens.
  await expect(view).toContainText('event_name');
  await expect(view).not.toContainText('csrf');
});
