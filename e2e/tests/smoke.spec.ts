import { expect, test } from '../fixtures/extension';

test('dashboard renders heading + kit theme applied', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/dashboard.html`);
  await expect(page.getByRole('heading', { name: 'event-bridge' })).toBeVisible();

  // Prove the CSS pipeline applied the kit theme: a kit Button (default variant)
  // paints the kit brand-base #F70864.
  const primary = page.getByRole('button', { name: 'Open vrc.tl' });
  await expect(primary).toBeVisible();
  expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(247, 8, 100)');

  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bodyBg).not.toBe('rgba(0, 0, 0, 0)');
  expect(bodyBg).not.toBe('rgb(255, 255, 255)');
});

test('popup renders the open-dashboard button', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.getByRole('button', { name: 'Open dashboard' })).toBeVisible();
});
