import { expect, test } from '../fixtures/extension';

test('dashboard renders heading + kit theme applied', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/dashboard.html`);
  await expect(page.getByRole('heading', { name: 'event-bridge' })).toBeVisible();

  // Prove the CSS pipeline applied the kit theme: a kit Button (default variant)
  // paints the AA fill --color-brand-base-fill #DB0759 (white-on-brand contrast).
  const primary = page.getByRole('button', { name: 'Open vrc.tl' });
  await expect(primary).toBeVisible();
  expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(219, 7, 89)');

  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bodyBg).not.toBe('rgba(0, 0, 0, 0)');
  expect(bodyBg).not.toBe('rgb(255, 255, 255)');

  // Body copy uses the Inter body face (kit type split), and the bundled font loads.
  const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(bodyFont).toContain('Inter Variable');
  const interLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.fonts.check('16px "Inter Variable"');
  });
  expect(interLoaded).toBe(true);
});

test('popup renders the open-dashboard button', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.getByRole('button', { name: 'Open dashboard' })).toBeVisible();
});
