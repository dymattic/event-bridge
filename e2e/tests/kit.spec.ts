// @rave-page/ui showcase e2e. SKIPPED until the lead wires the #/kit route:
// add to src/ui/dashboard/App.tsx (owned by another unit) a route mapping
// `#/kit` -> the default export of src/ui/dashboard/views/KitShowcase.tsx.
// Assertions below are ready to run once that lands (drop the test.skip lines).
import { expect, test } from '../fixtures/extension';

const KIT_URL = (id: string) => `chrome-extension://${id}/dashboard.html#/kit`;

test.describe('@rave-page/ui showcase (#/kit)', () => {
  test('Button default renders the brand-base background from the kit', async ({ context, extensionId }) => {
    test.skip(true, 'needs App.tsx wiring (lead): route #/kit -> KitShowcase');
    const page = await context.newPage();
    await page.goto(KIT_URL(extensionId));
    const btn = page.getByTestId('kit-button-default');
    await expect(btn).toBeVisible();
    // brand-base #F70864 — proves the kit's Button variant classes reached the built CSS
    expect(await btn.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(247, 8, 100)');
  });

  test('checked Switch renders the brand-mint background from the kit', async ({ context, extensionId }) => {
    test.skip(true, 'needs App.tsx wiring (lead): route #/kit -> KitShowcase');
    const page = await context.newPage();
    await page.goto(KIT_URL(extensionId));
    const sw = page.getByTestId('kit-switch');
    await expect(sw).toBeVisible();
    // showcase defaults the Switch checked -> data-[state=checked]:bg-brand-mint #08F79B
    expect(await sw.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(8, 247, 155)');
  });

  test('Dialog opens and closes', async ({ context, extensionId }) => {
    test.skip(true, 'needs App.tsx wiring (lead): route #/kit -> KitShowcase');
    const page = await context.newPage();
    await page.goto(KIT_URL(extensionId));
    await page.getByTestId('kit-dialog-trigger').click();
    await expect(page.getByTestId('kit-dialog-content')).toBeVisible();
    await page.getByTestId('kit-dialog-close').click();
    await expect(page.getByTestId('kit-dialog-content')).toHaveCount(0);
  });
});
