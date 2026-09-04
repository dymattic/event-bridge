// Edit-event e2e (vrcpop, mocks only). Open the editor on an existing event, change
// the title, confirm Review lists `title` under Changed fields, Run, then assert the
// recorded update carried the current optimistic-lock version + the new title.
import { expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder, type VrcpopRecorder } from '../mocks/vrcpop-api';

const T = 30_000;

test('vrcpop: edit the title and Run sends an update with the current version', async ({ context }) => {
  const rec: VrcpopRecorder = newRecorder(); // server version = 2
  await mockVrcpopSite(context, rec);
  await openPlatformTab(context, 'vrcpop');
  const page = await openDashboard(context);

  await page.evaluate(() => {
    location.hash = '#/events/vrcpop/100001/edit';
  });
  await page.reload();
  await expect(page.getByTestId('event-editor')).toBeVisible({ timeout: T });
  // source event loaded -> title prefilled
  await expect(page.getByTestId('editor-title')).toHaveValue("what's poppin", { timeout: T });

  await page.getByTestId('editor-title').fill('Renamed Night');

  await page.getByTestId('editor-tab-review').click();
  await expect(page.getByTestId('editor-changes-vrcpop')).toContainText('title', { timeout: T });

  await page.getByTestId('editor-run').click();

  await expect.poll(() => rec.updateBodies.length, { timeout: T }).toBeGreaterThan(0);
  expect(rec.updateBodies[0]).toMatchObject({ event_id: 100001, version: 2, event_name: 'Renamed Night' });
});
