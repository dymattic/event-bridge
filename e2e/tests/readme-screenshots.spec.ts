// README screenshot generator (mocks only; NEVER the real platforms/sessions).
// SKIPPED unless EB_SCREENSHOTS=1, so the normal `pnpm e2e` suite writes no
// images. Run via `pnpm screenshots` (builds first, sets the env). Every shot is
// driven off the same e2e fixtures + mocks the other specs use, with all three
// platforms connected, and each capture is asserted free of any real
// club/DJ/session string before it is written to docs/screenshots/.
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  enableRavepage,
  expect,
  openDashboard,
  openPopup,
  openPlatformTab,
  test,
} from '../fixtures/extension';
import { GROUP_ID, mockVrcpopSite, newRecorder } from '../mocks/vrcpop-api';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import { mockRavepageEvents, newRavepageRecorder, RP_GROUP, seedRavepageToken } from '../mocks/ravepage-events';
import type { Page } from '@playwright/test';

const T = 30_000;
const VRCTL_ORG = '9001';
const here = dirname(fileURLToPath(import.meta.url));
const SHOT_DIR = resolve(here, '..', '..', 'docs', 'screenshots');

// Public-repo hygiene: no capture may show a real club/DJ/session string. The
// mocks only ever emit Example Club / Example DJ / placeholder ids, so this
// asserts the guarantee per shot (visible text only — hrefs/attrs excluded).
const FORBIDDEN = ['DyMattic', 'dymattic', 'DyMension', 'Cauldron', 'Amplitude', 'Flexion', 'STONX', 'naise', '1727', '29854'];

async function assertClean(page: Page, shot: string): Promise<void> {
  const text = (await page.evaluate(() => document.body.innerText)).toLowerCase();
  for (const bad of FORBIDDEN) {
    if (text.includes(bad.toLowerCase())) throw new Error(`sanitization: ${shot} contains "${bad}"`);
  }
}

async function save(page: Page, name: string): Promise<void> {
  await assertClean(page, name);
  await page.screenshot({ path: resolve(SHOT_DIR, name), fullPage: false });
}

async function reset(page: Page): Promise<void> {
  await page.evaluate(() => chrome.storage.local.clear());
}
async function setStore(page: Page, obj: Record<string, unknown>): Promise<void> {
  await page.evaluate((o) => chrome.storage.local.set(o), obj);
}
async function enableRp(page: Page): Promise<void> {
  await enableRavepage(page);
  await seedRavepageToken(page);
}
async function gotoHash(page: Page, hash: string): Promise<void> {
  await page.evaluate((h) => {
    location.hash = h;
  }, hash);
  await page.reload();
}
async function pickClub(page: Page, platform: string, clubName: string): Promise<void> {
  await page.getByTestId(`editor-club-${platform}`).getByRole('button').first().click();
  await page.locator('[data-portal-surface="smart-select"]').getByRole('button', { name: clubName, exact: true }).click();
}
async function addSlot(page: Page, idx: number): Promise<void> {
  await page.getByRole('button', { name: 'Add slot' }).first().click();
  await page.getByTestId(`lineup-slot-${idx}`).getByLabel('Add performer').click();
  await page.getByRole('button', { name: /Search performers/ }).click();
  await page.getByPlaceholder(/Search performers/).fill('Example');
  const option = page.locator('[data-portal-surface="smart-select"]').getByRole('button', { name: /Example DJ/ }).first();
  await expect(option).toBeVisible({ timeout: T });
  await option.click();
}

test('generate README screenshots from the mocked platforms', async ({ context }) => {
  test.skip(process.env.EB_SCREENSHOTS !== '1', 'set EB_SCREENSHOTS=1 to generate (run: pnpm screenshots)');
  test.setTimeout(240_000);
  mkdirSync(SHOT_DIR, { recursive: true });

  const vp = newRecorder();
  const vt: RecordedRequest[] = [];
  const rprec = newRavepageRecorder();
  // A second look-alike for the "probably the same event" suggestion: a vrcpop
  // copy of rave.page's mock "Neon Cathedral", same club anchor (seeded below).
  await mockVrcpopSite(context, vp, {
    extraEvents: [{ id: 100003, title: 'Neon Cathedral', dateLabel: 'Mon, Feb 1, 2027 at 9:00 PM', sets: 1 }],
  });
  await mockVrctlSite(context, vt);
  await mockRavepageEvents(context, rprec);
  await openPlatformTab(context, 'vrcpop');
  await openPlatformTab(context, 'vrctl');
  const page = await openDashboard(context);
  await page.setViewportSize({ width: 1280, height: 800 });

  // 01 — Overview: three connected platform cards with clubs + upcoming counts.
  await reset(page);
  await enableRp(page);
  await gotoHash(page, '#/');
  await expect(page.getByTestId('overview-cards')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('platform-card-ravepage')).toBeVisible({ timeout: T });
  // Let every card finish loading its clubs + upcoming count (tab platforms pace
  // reads ≥300 ms), so no card is captured mid "Loading clubs… / …".
  await expect(page.getByText('Loading clubs…')).toHaveCount(0, { timeout: T });
  for (const p of ['vrctl', 'vrcpop', 'ravepage']) {
    await expect.poll(async () => (await page.getByTestId(`platform-upcoming-${p}`).textContent()) ?? '', { timeout: T }).not.toContain('…');
  }
  await save(page, '01-overview.png');

  // 02 + 06 — Events (linked Sync row + Transfer cell + suggestion) then the Sync sheet.
  await reset(page);
  await enableRp(page);
  await setStore(page, {
    links: [
      {
        anchorId: 'sync-1',
        refs: [{ platform: 'vrcpop', id: '100001' }, { platform: 'vrctl', id: '100002' }],
        createdAt: '2027-01-01T00:00:00Z',
        sync: { mode: 'notify', source: 'last-edited', fields: { details: true, lineup: false, poster: false, publishState: false } },
      },
    ],
    clubLinks: [
      {
        anchorId: GROUP_ID,
        members: {
          vrcpop: { organizerId: GROUP_ID, name: 'Example Club' },
          ravepage: { organizerId: RP_GROUP, name: 'Neon Collective' },
        },
      },
    ],
  });
  await gotoHash(page, '#/events?time=all');
  await expect(page.getByTestId('events-table')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('suggestions')).toContainText('Neon Cathedral', { timeout: T });

  const wpRow = page.locator('tr', { hasText: "what's poppin" }).first();
  const syncCell = wpRow.locator('[data-testid^="sync-cell-"]');
  await syncCell.click();
  await expect(page.getByTestId('sync-sheet')).toBeVisible({ timeout: T });
  await page.getByTestId('sync-baseline').click();
  await expect(page.getByTestId('sync-state-in-sync')).toBeVisible({ timeout: T });
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('sync-sheet')).toBeHidden({ timeout: T });

  vp.eventName = "what's poppin (edited)"; // vrcpop drifts on re-read
  await page.getByTestId('events-refresh').click();
  await expect.poll(async () => (await syncCell.textContent()) ?? '', { timeout: T }).toContain('1 pending');
  await save(page, '02-events.png');

  await syncCell.click();
  await expect(page.getByTestId('sync-sheet')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('sync-assessment')).toContainText('title', { timeout: T });
  await expect(page.getByTestId('sync-apply')).toBeVisible({ timeout: T });
  await save(page, '06-sync-sheet.png');
  await page.keyboard.press('Escape');

  // 03 + 04 + 05 — Editor basics, lineup, review (vrc.tl + vrcpop targets).
  await reset(page);
  await gotoHash(page, '#/events/new');
  await expect(page.getByTestId('event-editor')).toBeVisible({ timeout: T });
  await page.getByTestId('editor-target-vrctl').click();
  await page.getByTestId('editor-target-vrcpop').click();
  await pickClub(page, 'vrctl', 'Example Club');
  await pickClub(page, 'vrcpop', 'Example Club');
  await page.getByTestId('editor-title').fill('Warehouse Rave');
  await page.getByTestId('editor-start').fill('2027-03-14T22:00');
  await page.getByTestId('editor-tab-basics').click();
  await expect(page.getByTestId('editor-title')).toHaveValue('Warehouse Rave');
  await save(page, '03-editor-basics.png');

  await page.getByTestId('editor-tab-details').click();
  await page.getByTestId('editor-nsfw-sfw').click();
  await page.getByTestId('editor-flag-questCompatible').click(); // vrc.tl can't carry it -> a loss entry

  await page.getByTestId('editor-tab-lineup').click();
  await addSlot(page, 0);
  await addSlot(page, 1);
  await expect(page.getByTestId('lineup-slot-1')).toBeVisible({ timeout: T });
  await save(page, '04-editor-lineup.png');

  await page.getByTestId('editor-tab-review').click();
  await expect(page.getByTestId('editor-review-vrctl')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('editor-end-vrctl')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('loss-report').first()).toBeVisible({ timeout: T });
  for (const p of ['vrctl', 'vrcpop']) {
    await page.getByTestId(`editor-preview-disclosure-${p}`).evaluate((el) => {
      (el as HTMLDetailsElement).open = true;
    });
  }
  await expect(page.getByTestId('editor-preview-vrctl')).toBeVisible({ timeout: T });
  await save(page, '05-editor-review.png');

  // 07 — Jobs: a real mocked vrcpop create, then the done job expanded to its steps.
  await reset(page);
  await gotoHash(page, '#/events/new');
  await expect(page.getByTestId('event-editor')).toBeVisible({ timeout: T });
  await page.getByTestId('editor-target-vrcpop').click();
  await pickClub(page, 'vrcpop', 'Example Club');
  await page.getByTestId('editor-title').fill('Rooftop Session');
  await page.getByTestId('editor-start').fill('2030-05-01T22:00');
  await page.getByTestId('editor-tab-review').click();
  await page.getByTestId('editor-run').click();
  await expect.poll(() => vp.createBodies.length, { timeout: T }).toBeGreaterThan(0);
  // Wait for the run to fully finish (it routes to the new event's detail), then
  // hash-navigate (no reload) so the just-recorded job is in the log.
  await expect.poll(() => page.evaluate(() => location.hash), { timeout: T }).toBe('#/events/vrcpop/100010');
  await page.evaluate(() => {
    location.hash = '#/jobs';
  });
  await expect(page.getByTestId('jobs-view')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('jobs-table')).toBeVisible({ timeout: T });
  await page.locator('[data-testid^="job-details-"]').first().evaluate((el) => {
    (el as HTMLDetailsElement).open = true;
  });
  await expect(page.locator('[data-testid^="job-step-"]').first()).toBeVisible({ timeout: T });
  await save(page, '07-jobs.png');

  // 08 — Settings: Editor + Sync defaults + Experimental (rave.page off = compact).
  await reset(page);
  await gotoHash(page, '#/settings');
  await expect(page.getByTestId('settings-view')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('settings-developer-panels')).toBeVisible({ timeout: T });
  // Scroll past General so Editor + Sync defaults + Experimental (incl. the new
  // Developer panels toggle) all sit in frame — anchor on the Editor card title.
  const editorTitle = page.getByText('Editor', { exact: true }).first();
  await editorTitle.scrollIntoViewIfNeeded();
  const box = await editorTitle.boundingBox();
  if (box) await page.evaluate((dy) => window.scrollBy(0, dy), box.y - 28);
  await save(page, '08-settings.png');

  // 09 — Clubs: one linked club anchor (vrcpop auto + vrc.tl linked member).
  await reset(page);
  await setStore(page, {
    clubLinks: [{ anchorId: GROUP_ID, members: { vrctl: { organizerId: VRCTL_ORG, name: 'Example Club' } } }],
  });
  await gotoHash(page, '#/clubs');
  await expect(page.getByTestId('clubs-table')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('club-unlink-vrctl').first()).toBeVisible({ timeout: T });
  // Wait for both platforms' clubs to finish loading so the anchor shows the
  // vrcpop member too (not a mid-refresh "—").
  await expect(page.getByTestId('clubs-refresh')).toBeEnabled({ timeout: T });
  await expect(page.getByTestId('club-cell-vrcpop').first()).toBeVisible({ timeout: T });
  await save(page, '09-clubs.png');

  // 10 — Popup: per-platform session status (opened in its own small-viewport tab).
  await reset(page);
  await enableRp(page);
  const popup = await openPopup(context);
  await popup.setViewportSize({ width: 400, height: 600 });
  await expect(popup.getByTestId('status-vrctl')).toBeVisible({ timeout: T });
  await save(popup, '10-popup.png');
  await popup.close();
});
