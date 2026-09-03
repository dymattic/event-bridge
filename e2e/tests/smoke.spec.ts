import { expect, test } from '../fixtures/extension';

test('dashboard renders heading + Tailwind tokens applied', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/dashboard.html`);
  await expect(page.getByRole('heading', { name: 'event-bridge' })).toBeVisible();

  // Prove the CSS pipeline actually applied, not just class names present.
  const brand = page.getByTestId('brand');
  await expect(brand).toBeVisible();
  expect(await brand.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(247, 8, 100)');

  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bodyBg).not.toBe('rgba(0, 0, 0, 0)');
  expect(bodyBg).not.toBe('rgb(255, 255, 255)');
});

test('popup renders the open-dashboard button', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.getByRole('button', { name: 'Open dashboard' })).toBeVisible();
});
