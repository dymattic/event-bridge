// Auto-sync e2e (mocks only). A linked vrcpop+vrc.tl "what's poppin": baseline it,
// let vrcpop drift on re-read, and confirm notify surfaces "1 pending", Apply writes
// the new title to vrc.tl and returns to "In sync"; conflicts block Apply until a
// per-field pick (no write before it); apply-mode writes drift on Refresh and logs a
// sync job; off does nothing. The extension never writes to vrcpop here (source only).
import { expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder, type VrcpopRecorder } from '../mocks/vrcpop-api';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import type { BrowserContext, Page } from '@playwright/test';

const T = 30_000;
const DETAILS_ONLY = { details: true, lineup: false, poster: false, publishState: false };

interface Sync {
  mode: 'off' | 'notify' | 'apply';
  source: 'last-edited' | 'vrcpop' | 'vrctl' | 'ravepage';
  fields: { details: boolean; lineup: boolean; poster: boolean; publishState: boolean };
  publishConfirmed?: boolean;
}

async function setup(context: BrowserContext): Promise<{ page: Page; vp: VrcpopRecorder; vt: RecordedRequest[] }> {
  const vp = newRecorder();
  const vt: RecordedRequest[] = [];
  await mockVrcpopSite(context, vp);
  await mockVrctlSite(context, vt);
  await openPlatformTab(context, 'vrcpop');
  await openPlatformTab(context, 'vrctl');
  const page = await openDashboard(context);
  return { page, vp, vt };
}

async function seedLink(page: Page, sync: Sync, lastSynced?: Record<string, { hash: string; at: string }>): Promise<void> {
  await page.evaluate(
    (arg) =>
      chrome.storage.local.set({
        links: [
          {
            anchorId: 'sync-1',
            refs: [{ platform: 'vrcpop', id: '100001' }, { platform: 'vrctl', id: '100002' }],
            createdAt: '2027-01-01T00:00:00Z',
            sync: arg.sync,
            lastSynced: arg.lastSynced,
          },
        ],
      }),
    { sync, lastSynced },
  );
}

async function gotoEvents(page: Page): Promise<void> {
  await page.evaluate(() => { location.hash = '#/events'; });
  await page.reload();
  await expect(page.getByTestId('events-table')).toBeVisible({ timeout: T });
}

function syncCell(page: Page) {
  return page.locator('[data-testid^="sync-cell-"]').first();
}
async function openSheet(page: Page): Promise<void> {
  await syncCell(page).click();
  await expect(page.getByTestId('sync-sheet')).toBeVisible({ timeout: T });
}
async function closeSheet(page: Page): Promise<void> {
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('sync-sheet')).toBeHidden({ timeout: T });
}
function vtDetailPosts(vt: RecordedRequest[]): number {
  return vt.filter((r) => r.method === 'POST' && r.path.startsWith('/admin/event/detail/')).length;
}

test('notify: baseline, drift on vrcpop -> 1 pending -> Apply writes the new title to vrc.tl -> In sync', async ({ context }) => {
  const { page, vp, vt } = await setup(context);
  await seedLink(page, { mode: 'notify', source: 'last-edited', fields: DETAILS_ONLY });
  await gotoEvents(page);

  // Baseline both refs at their current state.
  await openSheet(page);
  await page.getByTestId('sync-baseline').click();
  await expect(page.getByTestId('sync-state-in-sync')).toBeVisible({ timeout: T });
  await closeSheet(page);

  // vrcpop's title drifts on re-read.
  vp.eventName = "what's poppin EDIT";
  await page.getByTestId('events-refresh').click();
  await expect.poll(async () => (await syncCell(page).textContent()) ?? '', { timeout: T }).toContain('1 pending');

  await openSheet(page);
  await expect(page.getByTestId('sync-assessment')).toContainText('title', { timeout: T });
  const before = vtDetailPosts(vt);
  await page.getByTestId('sync-apply').click();

  await expect.poll(() => vtDetailPosts(vt), { timeout: T }).toBeGreaterThan(before);
  const write = [...vt].reverse().find((r) => r.method === 'POST' && r.path.startsWith('/admin/event/detail/'));
  expect(write?.postData ?? '').toContain("what's poppin EDIT"); // new title carried
  expect(write?.postData ?? '').toMatch(/slots\[\d+\]/); // current slot ids carried
  await expect(page.getByTestId('sync-state-in-sync')).toBeVisible({ timeout: T });

  // The extension never wrote to vrcpop (source only).
  expect(vp.updateBodies).toHaveLength(0);
});

test('conflict: both stale -> Conflict, Apply disabled + no write until every field is picked', async ({ context }) => {
  const { page, vt } = await setup(context);
  // Explicit source vrcpop; vrctl drifted from its (stale) baseline -> the vrctl
  // target is a conflict, applied only after a per-field pick. (Source vrcpop, so
  // any write targets vrc.tl — never vrcpop.)
  await seedLink(page, { mode: 'notify', source: 'vrcpop', fields: DETAILS_ONLY }, {
    vrcpop: { hash: 'stale-a', at: '2027-01-01T00:00:00Z' },
    vrctl: { hash: 'stale-b', at: '2027-01-01T00:00:00Z' },
  });
  await gotoEvents(page);
  await expect.poll(async () => (await syncCell(page).textContent()) ?? '', { timeout: T }).toContain('Conflict');

  await openSheet(page);
  await expect(page.getByTestId('sync-apply')).toBeDisabled({ timeout: T });
  expect(vtDetailPosts(vt)).toBe(0); // no write before any pick

  // Resolve every conflicting field (keep-target is a valid pick; a source pick on
  // a field the source can't represent, e.g. nsfw, would clear a required value).
  const picks = page.locator('[data-testid^="sync-pick-"][data-testid$="-target"]');
  const n = await picks.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) await picks.nth(i).click();

  await expect(page.getByTestId('sync-apply')).toBeEnabled({ timeout: T });
  await page.getByTestId('sync-apply').click();
  await expect.poll(() => vtDetailPosts(vt), { timeout: T }).toBeGreaterThan(0);
});

test('apply mode: Refresh writes the drift automatically and logs a sync job', async ({ context }) => {
  const { page, vp, vt } = await setup(context);
  await seedLink(page, { mode: 'apply', source: 'last-edited', fields: DETAILS_ONLY });
  await gotoEvents(page);

  await openSheet(page);
  await page.getByTestId('sync-baseline').click();
  await expect(page.getByTestId('sync-state-in-sync')).toBeVisible({ timeout: T });
  await closeSheet(page);

  vp.eventName = "what's poppin AUTO";
  const before = vtDetailPosts(vt);
  await page.getByTestId('events-refresh').click();
  await expect.poll(() => vtDetailPosts(vt), { timeout: T }).toBeGreaterThan(before); // written without opening the sheet

  await page.evaluate(() => { location.hash = '#/jobs'; });
  await expect(page.getByTestId('jobs-view')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('jobs-view')).toContainText('sync', { timeout: T });
});

test('off: no assessment (cell shows —), no sync writes', async ({ context }) => {
  const { page, vt } = await setup(context);
  await seedLink(page, { mode: 'off', source: 'last-edited', fields: DETAILS_ONLY });
  await gotoEvents(page);
  await expect(syncCell(page)).toHaveText('—', { timeout: T });
  expect(vtDetailPosts(vt)).toBe(0);
});
