// #/gigs ("My gigs") e2e against mocks only. Enter a DJ name -> event-bridge reads
// each connected platform ONCE for upcoming events with that name on the lineup,
// shows a compact grouped list with public links, and exports an .ics. Asserts
// load-once (profileGets stays 1 until Refresh), resolved names (no raw ids), the
// ICS download, and the rave.page pending-booking path.
import { enableRavepage, expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder, type VrcpopRecorder } from '../mocks/vrcpop-api';
import { mockRavepageEvents, newRavepageRecorder, seedRavepageToken } from '../mocks/ravepage-events';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import { MAX_TIMELINE_PAGES } from '../../src/adapters/vrctl/adapter';
import type { BrowserContext, Page } from '@playwright/test';

const T = 30_000;
const tlCount = (rec: RecordedRequest[]): number => rec.filter((r) => r.path === '/api/v1/events').length;

async function setupVrcpop(context: BrowserContext): Promise<{ page: Page; rec: VrcpopRecorder }> {
  const rec = newRecorder();
  await mockVrcpopSite(context, rec);
  await openPlatformTab(context, 'vrcpop');
  const page = await openDashboard(context);
  await page.evaluate(() => {
    location.hash = '#/gigs';
  });
  await page.reload();
  await expect(page.getByTestId('gigs')).toBeVisible({ timeout: T });
  return { page, rec };
}

async function addName(page: Page, name: string): Promise<void> {
  await page.getByTestId('gigs-name-input').fill(name);
  await page.getByTestId('gigs-name-input').press('Enter');
}

test('adds a DJ name and lists gigs from the performer profile, loading once', async ({ context }) => {
  const { page, rec } = await setupVrcpop(context);
  await expect(page.getByTestId('gigs-empty-names')).toBeVisible({ timeout: T });

  await addName(page, 'Example DJ');

  const table = page.getByTestId('gigs-table');
  await expect(table).toContainText('Example Night', { timeout: T });
  await expect(table).toContainText('Example Club');
  await expect(page.getByTestId('gigs-link-vrcpop').first()).toHaveAttribute('href', 'https://vrcpop.com/event/100777');

  // Loaded exactly once (no timer / no background poll).
  await expect.poll(() => rec.profileGets, { timeout: T }).toBe(1);
  await page.waitForTimeout(3000);
  expect(rec.profileGets).toBe(1);

  // Explicit Refresh re-reads once more.
  await page.getByTestId('gigs-refresh').click();
  await expect.poll(() => rec.profileGets, { timeout: T }).toBe(2);
});

test('vrc.tl: lists a gig from the public timeline at a club the user does not manage', async ({ context }) => {
  const rec: RecordedRequest[] = [];
  await mockVrctlSite(context, rec);
  await openPlatformTab(context, 'vrctl');
  const page = await openDashboard(context);
  await page.evaluate(() => {
    location.hash = '#/gigs';
  });
  await page.reload();
  await expect(page.getByTestId('gigs')).toBeVisible({ timeout: T });

  await addName(page, 'Example DJ');

  const table = page.getByTestId('gigs-table');
  await expect(table).toContainText('Timeline Night', { timeout: T });
  await expect(page.locator('a[data-testid="gigs-link-vrctl"][href="https://vrc.tl/event/300001"]').first()).toBeVisible({ timeout: T });

  // Bounded, load-once: one paged pass (≤ cap) and no more until Refresh.
  await expect.poll(() => tlCount(rec), { timeout: T }).toBeGreaterThan(0);
  const afterLoad = tlCount(rec);
  expect(afterLoad).toBeLessThanOrEqual(MAX_TIMELINE_PAGES);
  await page.waitForTimeout(2000);
  expect(tlCount(rec)).toBe(afterLoad); // no background polling

  await page.getByTestId('gigs-refresh').click();
  await expect.poll(() => tlCount(rec), { timeout: T }).toBe(afterLoad + 1); // exactly one more pass
});

test('exports an ICS file', async ({ context }) => {
  const { page } = await setupVrcpop(context);
  await addName(page, 'Example DJ');
  await expect(page.getByTestId('gigs-table')).toContainText('Example Night', { timeout: T });

  const downloadPromise = page.waitForEvent('download', { timeout: T });
  await page.getByTestId('gigs-export').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.ics$/);

  const stream = await download.createReadStream();
  let content = '';
  for await (const chunk of stream) content += chunk.toString();
  expect(content).toContain('BEGIN:VCALENDAR');
  expect(content).toContain('Example Night');
});

test('lists pending bookings from rave.page', async ({ context }) => {
  await mockRavepageEvents(context, newRavepageRecorder());
  const page = await openDashboard(context);
  await seedRavepageToken(page);
  await enableRavepage(page); // rave.page is an equal integration here only with the toggle on
  await page.evaluate(() => {
    location.hash = '#/gigs';
  });
  await page.reload();
  await expect(page.getByTestId('gigs')).toBeVisible({ timeout: T });

  await addName(page, 'Example DJ');

  const table = page.getByTestId('gigs-table');
  await expect(table).toContainText('Booked Night', { timeout: T });
  await expect(table).toContainText('Pending Night');
  await expect(page.getByTestId('gigs-count')).toContainText('2 upcoming gigs');

  // The unaccepted booking carries the "pending" badge; the accepted one does not.
  await expect(table.getByText('pending', { exact: true }).first()).toBeVisible();
  await expect(page.getByTestId('gigs-link-ravepage').first()).toHaveAttribute(
    'href',
    /^https:\/\/development\.rave\.page\/events\//,
  );
});
