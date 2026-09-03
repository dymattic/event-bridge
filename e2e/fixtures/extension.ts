// Loads dist/chrome into a persistent Chromium context (MV3 needs a real profile).
import { chromium, test as base, type BrowserContext } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const distChrome = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist', 'chrome');

export const test = base.extend<{ context: BrowserContext; extensionId: string }>({
  context: async ({}, use) => {
    const userDataDir = mkdtempSync(resolve(tmpdir(), 'eb-e2e-'));
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chromium',
      args: [`--disable-extensions-except=${distChrome}`, `--load-extension=${distChrome}`],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [sw] = context.serviceWorkers();
    sw ??= await context.waitForEvent('serviceworker');
    await use(new URL(sw.url()).host);
  },
});

export const expect = test.expect;
