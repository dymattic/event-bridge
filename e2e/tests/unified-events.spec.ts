// #/events (unified) + #/clubs e2e against mocks only. Covers: club linking,
// the "probably the same event" suggestion + one-click Link, per-cell Transfer
// into the editor, the missing filter, Unlink, the rave.page third column, and
// mobile overflow. Never touches the real platforms.
import { enableRavepage, expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { GROUP_ID, mockVrcpopSite, newRecorder } from '../mocks/vrcpop-api';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import { mockRavepageEvents, newRavepageRecorder, seedRavepageToken } from '../mocks/ravepage-events';
import type { BrowserContext, Page } from '@playwright/test';

const T = 30_000;
const VRCTL_ORG = '9001';
const RAW_ID = /^(grp_|evt_|usr_)|^user \d+$/;

async function setup(context: BrowserContext, opts: { ravepage?: boolean } = {}): Promise<Page> {
  await mockVrcpopSite(context, newRecorder());
  const vt: RecordedRequest[] = [];
  await mockVrctlSite(context, vt);
  await mockRavepageEvents(context, newRavepageRecorder());
  await openPlatformTab(context, 'vrcpop');
  await openPlatformTab(context, 'vrctl');
  const page = await openDashboard(context);
  if (opts.ravepage) {
    await seedRavepageToken(page);
    await enableRavepage(page);
  }
  return page;
}

async function gotoHash(page: Page, hash: string): Promise<void> {
  await page.evaluate((h) => {
    location.hash = h;
  }, hash);
  await page.reload();
}

// Extension storage only (never sent to a platform): pre-link the two Example Clubs.
async function seedClubLink(page: Page): Promise<void> {
  await page.evaluate(
    ({ grp, org }) => chrome.storage.local.set({ clubLinks: [{ anchorId: grp, members: { vrctl: { organizerId: org, name: 'Example Club' } } }] }),
    { grp: GROUP_ID, org: VRCTL_ORG },
  );
}

// Pre-link the two "what's poppin" events (vrcpop 100001 + vrc.tl 100002).
async function seedEventLink(page: Page): Promise<void> {
  await page.evaluate(() =>
    chrome.storage.local.set({
      links: [{ anchorId: 'seed-1', refs: [{ platform: 'vrcpop', id: '100001' }, { platform: 'vrctl', id: '100002' }], createdAt: '2027-01-01T00:00:00Z' }],
    }),
  );
}

test('#/clubs links the two Example Clubs into one anchor via the SmartSelect', async ({ context }) => {
  const page = await setup(context);
  await gotoHash(page, '#/clubs');
  await expect(page.getByTestId('clubs-table')).toBeVisible({ timeout: T });

  // two separate anchors -> a vrc.tl picker on the grp anchor, a vrcpop picker on the solo anchor
  await expect(page.getByTestId('club-link-vrctl').first()).toBeVisible({ timeout: T });
  await expect(page.getByTestId('club-link-vrcpop').first()).toBeVisible();

  // link vrc.tl's Example Club into the vrcpop (grp) anchor
  await page.getByTestId('club-link-vrctl').first().getByRole('button').first().click();
  await page.locator('[data-portal-surface="smart-select"]').getByRole('button', { name: 'Example Club', exact: true }).click();

  // one anchor now: vrc.tl is a linked member (Unlink), no vrc.tl picker left
  await expect(page.getByTestId('club-unlink-vrctl').first()).toBeVisible({ timeout: T });
  await expect(page.getByTestId('club-link-vrctl')).toHaveCount(0);
  const links = await page.evaluate(() => chrome.storage.local.get('clubLinks'));
  expect((links.clubLinks as unknown[]).length).toBe(1);
});

test('a "probably the same event" suggestion links two copies into one row that survives reload', async ({ context }) => {
  const page = await setup(context);
  await seedClubLink(page); // same club anchor is the precondition for a suggestion
  await gotoHash(page, '#/events?time=all');
  await expect(page.getByTestId('events-table')).toBeVisible({ timeout: T });

  // the suggestion appears (both copies of "what's poppin")
  await expect(page.getByTestId('suggestions')).toContainText("what's poppin", { timeout: T });
  await expect(page.getByTestId('suggest-link').first()).toBeVisible();

  await page.getByTestId('suggest-link').first().click();

  // one linked row with both cells + an Unlink; suggestion consumed
  await expect(page.getByTestId('row-unlink').first()).toBeVisible({ timeout: T });
  await expect(page.getByTestId('suggest-link')).toHaveCount(0);
  const row = page.locator('tr', { hasText: "what's poppin" }).first();
  await expect(row.locator('[data-testid^="cell-vrctl-"]')).toBeVisible();
  await expect(row.locator('[data-testid^="cell-vrcpop-"]')).toBeVisible();

  // no raw id is a table cell's primary text
  const leaked = await page
    .locator('[data-testid="events-table"] td')
    .evaluateAll((tds, re) => tds.map((td) => (td.textContent ?? '').trim()).filter((t) => new RegExp(re).test(t)), RAW_ID.source);
  expect(leaked).toEqual([]);

  // survives a reload (the link is persisted in extension storage)
  await page.reload();
  await expect(page.getByTestId('row-unlink').first()).toBeVisible({ timeout: T });
});

test('a missing-on-a-platform copy shows Transfer that opens the editor with both targets ticked', async ({ context }) => {
  const page = await setup(context);
  await gotoHash(page, '#/events?time=all');
  await expect(page.getByTestId('events-table')).toBeVisible({ timeout: T });

  // vrc.tl "just spinnin" has no vrcpop copy -> a Transfer into edit?targets=vrcpop
  const transfer = page.locator('a[href="#/events/vrctl/29778/edit?targets=vrcpop"]').first();
  await expect(transfer).toBeVisible({ timeout: T });
  await transfer.click();

  await expect(page.getByTestId('event-editor')).toBeVisible({ timeout: T });
  // edit mode = source ticked; ?targets=vrcpop = extra create target ticked
  await expect(page.getByTestId('editor-club-vrctl')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('editor-club-vrcpop')).toBeVisible();
  await expect(page.getByTestId('editor-title')).not.toHaveValue('');
});

test('the missing filter narrows to rows missing a platform cell', async ({ context }) => {
  const page = await setup(context);
  await seedEventLink(page); // "what's poppin" becomes one full (both-platform) row
  await gotoHash(page, '#/events?time=all');
  await expect(page.getByTestId('events-table')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('events-table')).toContainText("what's poppin");

  await page.getByTestId('filter-missing').first().click();

  // the full row drops out; the single-platform rows remain
  await expect(page.getByTestId('events-table')).not.toContainText("what's poppin", { timeout: T });
  await expect(page.getByTestId('events-table')).toContainText('just spinnin');
  await expect(page.getByTestId('events-table')).toContainText('draft night');
});

test('Unlink restores the two separate rows', async ({ context }) => {
  const page = await setup(context);
  await seedEventLink(page);
  await gotoHash(page, '#/events?time=all');
  await expect(page.getByTestId('row-unlink').first()).toBeVisible({ timeout: T });

  await page.getByTestId('row-unlink').first().click();

  // link gone -> the vrc.tl copy is a singleton again with a Transfer to vrcpop
  await expect(page.getByTestId('row-unlink')).toHaveCount(0, { timeout: T });
  await expect(page.locator('a[href="#/events/vrctl/100002/edit?targets=vrcpop"]').first()).toBeVisible();
  const links = await page.evaluate(() => chrome.storage.local.get('links'));
  expect((links.links as unknown[]).length).toBe(0);
});

test('with rave.page enabled a third column appears; its rows offer Transfer to the tab platforms', async ({ context }) => {
  const page = await setup(context, { ravepage: true });
  await gotoHash(page, '#/events?time=all');
  await expect(page.getByTestId('events-table')).toBeVisible({ timeout: T });

  await expect(page.getByRole('columnheader', { name: 'rave.page' })).toBeVisible({ timeout: T });
  await expect(page.getByTestId('events-table')).toContainText('Neon Cathedral');
  // a rave.page-only row offers Transfer to vrc.tl + vrcpop
  await expect(page.getByTestId('cell-transfer-vrctl').first()).toBeVisible();
  await expect(page.getByTestId('cell-transfer-vrcpop').first()).toBeVisible();
});

test('375x812 viewport has no horizontal page overflow', async ({ context }) => {
  const page = await setup(context);
  await page.setViewportSize({ width: 375, height: 812 });
  await gotoHash(page, '#/events?time=all');
  await expect(page.getByTestId('events-table')).toBeVisible({ timeout: T });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
