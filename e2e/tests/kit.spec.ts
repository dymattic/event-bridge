// @rave-page/ui showcase e2e. Drives the built #/kit route (App.tsx hash router
// -> KitShowcase default export). Proves the vendored kit's Button/Switch variant
// classes reach the compiled CSS and the Dialog opens/closes.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from '../fixtures/extension';

const KIT_URL = (id: string) => `chrome-extension://${id}/dashboard.html#/kit`;

// Kit >=0.1.1: brand glows follow --color-brand-base, so the extension's teal
// override re-tints them. Built CSS must carry NO rave.page pink.
test('built styles.css carries no rave.page brand pink', () => {
  const css = readFileSync(resolve('build/styles.css'), 'utf8').toLowerCase();
  expect(css).not.toContain('f70864');
  expect(css).not.toMatch(/247, ?8, ?100/);
});

test.describe('@rave-page/ui showcase (#/kit)', () => {
  test('Button default renders the brand-base background from the kit', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(KIT_URL(extensionId));
    const btn = page.getByTestId('kit-button-default');
    await expect(btn).toBeVisible();
    // neutral brand-base #14B8A6 (extension @theme override) — proves the kit's
    // Button variant classes reached the built CSS AND the override won the cascade
    expect(await btn.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(20, 184, 166)');
  });

  test('Button default glow follows the theme: teal box-shadow, no rave.page pink', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(KIT_URL(extensionId));
    const btn = page.getByTestId('kit-button-default');
    await expect(btn).toBeVisible();
    // shadow-brand-glow resolves via color-mix off --color-brand-base (#14B8A6).
    // Chromium serializes the color-mix result as color(srgb r g b / a) floats;
    // parse every colour token to a 0-255 "r, g, b" triple (also handles a
    // future rgb()/rgba() serialization) and assert on the channels.
    const { raw, triples } = await btn.evaluate((el) => {
      const raw = getComputedStyle(el).boxShadow;
      const triples: string[] = [];
      const re = /color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?:\s*\/\s*[\d.]+)?\)|rgba?\((\d+),\s*(\d+),\s*(\d+)/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(raw)) !== null) {
        if (m[1]) triples.push([m[1], m[2], m[3]].map((v) => Math.round(parseFloat(v ?? '0') * 255)).join(', '));
        else triples.push(`${m[4]}, ${m[5]}, ${m[6]}`);
      }
      return { raw, triples };
    });
    const msg = `box-shadow "${raw}" -> triples [${triples.join(' | ')}]`;
    expect(triples, msg).toContain('20, 184, 166'); // teal glow
    expect(triples, msg).not.toContain('247, 8, 100'); // no rave.page pink
    expect(raw.toLowerCase(), msg).not.toContain('f70864');
  });

  test('checked Switch renders the brand-mint background from the kit', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(KIT_URL(extensionId));
    const sw = page.getByTestId('kit-switch');
    await expect(sw).toBeVisible();
    // showcase defaults the Switch checked -> data-[state=checked]:bg-brand-mint,
    // now the neutral #22C55E from the extension @theme override
    expect(await sw.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(34, 197, 94)');
  });

  test('Dialog opens and closes', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(KIT_URL(extensionId));
    await page.getByTestId('kit-dialog-trigger').click();
    await expect(page.getByTestId('kit-dialog-content')).toBeVisible();
    await page.getByTestId('kit-dialog-close').click();
    await expect(page.getByTestId('kit-dialog-content')).toHaveCount(0);
  });
});
