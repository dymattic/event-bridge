// LineupEditor e2e on the #/dev/lineup harness (mocks only; never real
// platforms). Covers slot reorder, cross-platform performer search + add, the
// vrc.tl gap -> "Make contiguous" flow, and mobile layout with no h-overflow.
import { expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrctlSite, type RecordedRequest } from '../mocks/vrctl-site';
import type { BrowserContext, Page } from '@playwright/test';

const T = 20_000;

async function openLineup(context: BrowserContext): Promise<Page> {
  const page = await openDashboard(context);
  await page.evaluate(() => {
    location.hash = '#/dev/lineup';
  });
  await page.reload();
  await expect(page.getByTestId('lineup-dev-panel')).toBeVisible({ timeout: T });
  return page;
}

test('slot move-down reorders the core lineup JSON', async ({ context }) => {
  const page = await openLineup(context);
  const json = page.getByTestId('lineup-json');
  await expect(json).toContainText('Example DJ 1');

  // slot 0's slot-level move-down (first "Move down" in the slot: header precedes rows)
  await page.getByTestId('lineup-slot-0').getByLabel('Move down').first().click();

  const after = (await json.textContent()) ?? '';
  expect(after.indexOf('Example DJ 2')).toBeGreaterThanOrEqual(0);
  expect(after.indexOf('Example DJ 2')).toBeLessThan(after.indexOf('Example DJ 1'));
});

test('vrc.tl target surfaces a gap badge + "Make contiguous" that closes the gap', async ({ context }) => {
  const page = await openLineup(context);
  await page.getByTestId('lineup-target-vrctl').click();

  await expect(page.getByText(/min after the previous slot ends/)).toBeVisible({ timeout: T });
  const contiguous = page.getByRole('button', { name: 'Make contiguous' });
  await expect(contiguous).toBeVisible();
  await contiguous.click();

  const json = (await page.getByTestId('lineup-json').textContent()) ?? '';
  expect(json).not.toContain('21:30'); // the 30-min gap is gone
  expect(json).toContain('21:00:00.000Z'); // slot 2 now starts when slot 1 ends
  await expect(page.getByRole('button', { name: 'Make contiguous' })).toHaveCount(0);
});

test('add a performer via cross-platform search resolves the name + adds a platform alias', async ({ context }) => {
  const rec: RecordedRequest[] = [];
  await mockVrctlSite(context, rec);
  await openPlatformTab(context, 'vrctl');

  const page = await openLineup(context);
  await page.getByTestId('lineup-target-vrctl').click();

  // open the add-performer panel on slot 0, then the async SmartSelect
  await page.getByTestId('lineup-slot-0').getByLabel('Add performer').click();
  await page.getByRole('button', { name: /Search performers/ }).click();
  await page.getByPlaceholder(/Search performers/).fill('Example');

  const option = page.getByRole('button', { name: 'Example DJ' });
  await expect(option).toBeVisible({ timeout: T });
  await option.click();

  // resolved NAME shows as a row (exact, distinct from the seeded "Example DJ 1")
  await expect(page.getByTestId('lineup-slot-0').getByText('Example DJ', { exact: true })).toBeVisible();
  // JSON gains the vrc.tl alias (platform + the mock's performer id 300001)
  const json = (await page.getByTestId('lineup-json').textContent()) ?? '';
  expect(json).toContain('"platform": "vrctl"');
  expect(json).toContain('"id": "300001"');
});

test('mobile 375x812 renders without horizontal overflow', async ({ context }) => {
  const page = await openDashboard(context);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => {
    location.hash = '#/dev/lineup';
  });
  await page.reload();
  await expect(page.getByTestId('lineup-dev-panel')).toBeVisible({ timeout: T });
  // select every target so all capability affordances render at the narrow width
  await page.getByTestId('lineup-target-vrctl').click();

  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    return d.scrollWidth > d.clientWidth || document.body.scrollWidth > document.body.clientWidth;
  });
  expect(overflow).toBe(false);
});
