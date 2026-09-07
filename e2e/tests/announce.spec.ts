// #/announce e2e (mocks only). Renders a Discord-ready announcement for a vrcpop
// event from a preset: live <t:> timestamps, lineup names and PUBLIC platform
// links (never the manage URL); user presets persist; copy toasts + exposes the
// exact text; EventDetail links here.
import { expect, openDashboard, openPlatformTab, test } from '../fixtures/extension';
import { mockVrcpopSite, newRecorder } from '../mocks/vrcpop-api';
import type { BrowserContext, Page } from '@playwright/test';

const T = 30_000;

async function setup(context: BrowserContext): Promise<Page> {
  await mockVrcpopSite(context, newRecorder());
  await openPlatformTab(context, 'vrcpop');
  return openDashboard(context);
}

async function openHash(page: Page, hash: string): Promise<void> {
  await page.evaluate((h) => {
    location.hash = h;
  }, hash);
  await page.reload();
}

test('announce preview: <t:> timestamp, public URL, lineup name, no manage URL', async ({ context }) => {
  const page = await setup(context);
  await openHash(page, '#/announce?platform=vrcpop&id=100001');
  await expect(page.getByTestId('announce')).toBeVisible({ timeout: T });
  await expect(page.getByTestId('announce-preview')).toBeVisible({ timeout: T });
  const preview = (await page.getByTestId('announce-preview').textContent()) ?? '';
  expect(preview).toContain('<t:');
  expect(preview).toContain('https://vrcpop.com/event/100001');
  expect(preview).toContain('Example DJ'); // performer from the lineup fixture
  expect(preview).not.toContain('/manage/club/'); // public link, never the owner surface
});

test('duplicate a builtin, edit + save a preset, and it persists across reload', async ({ context }) => {
  const page = await setup(context);
  await openHash(page, '#/announce?platform=vrcpop&id=100001');
  await expect(page.getByTestId('announce-preset-duplicate')).toBeVisible({ timeout: T });
  await page.getByTestId('announce-preset-duplicate').click(); // "Duplicate to edit"
  await expect(page.getByTestId('announce-preset-footer')).toBeEditable({ timeout: T });
  await page.getByTestId('announce-preset-footer').fill('Footer test {links}');
  await expect(page.getByTestId('announce-preset-save')).toBeEnabled();
  await page.getByTestId('announce-preset-save').click();

  await page.reload();
  await expect(page.getByTestId('announce-preset-footer')).toHaveValue('Footer test {links}', { timeout: T });
});

test('copy toasts and exposes the exact announcement text', async ({ context }) => {
  const page = await setup(context);
  await openHash(page, '#/announce?platform=vrcpop&id=100001');
  await expect(page.getByTestId('announce-copy')).toBeEnabled({ timeout: T });
  const pre = (await page.getByTestId('announce-preview').textContent()) ?? '';
  await page.getByTestId('announce-copy').click();
  // clipboard permission may be denied to extension pages in headless Chromium;
  // the execCommand fallback must still toast success.
  await expect(page.getByText('Copied to clipboard')).toBeVisible({ timeout: T });
  const raw = await page.locator('[data-testid="announce-raw"]').inputValue();
  expect(raw).toBe(pre);
});

test('EventDetail links to the announce route', async ({ context }) => {
  const page = await setup(context);
  await openHash(page, '#/events/vrcpop/100001');
  await expect(page.getByTestId('event-detail')).toBeVisible({ timeout: T });
  const link = page.getByTestId('event-detail-announce');
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '#/announce?platform=vrcpop&id=100001');
});
