// Loads dist/chrome into a persistent Chromium context (MV3 needs a real profile)
// and provides platform-mock + page helpers. Tests NEVER hit real platforms —
// all three origins are served from self-authored fixtures under e2e/mocks/.
import { chromium, test as base, type BrowserContext, type Page } from '@playwright/test';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const distChrome = resolve(here, '..', '..', 'dist', 'chrome');
const mocksDir = resolve(here, '..', 'mocks');

export type MockPlatform = 'vrcpop' | 'vrctl' | 'ravepage';
export type MockVariant = 'logged-in' | 'logged-out';

// Entry URLs mirror src/runtime/tabs.ts (duplicated: the src module imports the
// chrome-only webext shim and can't load in the Playwright/node runner).
export const PLATFORM_ENTRY: Record<MockPlatform, string> = {
  vrcpop: 'https://vrcpop.com/dashboard',
  vrctl: 'https://vrc.tl/admin/event',
  ravepage: 'https://development.rave.page/',
};

function mock(name: string): string {
  return readFileSync(resolve(mocksDir, name), 'utf8');
}

function fill(html: string, loggedIn: boolean): string {
  return html.replace(/__LOGGEDIN__/g, loggedIn ? 'true' : 'false');
}

export const test = base.extend<{ context: BrowserContext; extensionId: string }>({
  context: async ({}, use) => {
    const userDataDir = mkdtempSync(resolve(tmpdir(), 'eb-e2e-'));
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chromium',
      args: [`--disable-extensions-except=${distChrome}`, `--load-extension=${distChrome}`],
    });
    try {
      await use(context);
    } finally {
      await context.close();
      // Persistent contexts don't remove their profile; without this the temp dir
      // leaks one Chromium profile per test (thousands over time -> disk-full flakes).
      rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    }
  },
  extensionId: async ({ context }, use) => {
    await use(await getExtensionId(context));
  },
});

export const expect = test.expect;

export async function getExtensionId(context: BrowserContext): Promise<string> {
  let [sw] = context.serviceWorkers();
  sw ??= await context.waitForEvent('serviceworker');
  return new URL(sw.url()).host;
}

export async function openDashboard(context: BrowserContext): Promise<Page> {
  const id = await getExtensionId(context);
  const page = await context.newPage();
  await page.goto(`chrome-extension://${id}/dashboard.html`);
  return page;
}

export async function openPopup(context: BrowserContext): Promise<Page> {
  const id = await getExtensionId(context);
  const page = await context.newPage();
  await page.goto(`chrome-extension://${id}/popup.html`);
  return page;
}

// Enable the experimental rave.page integration by writing the extension's own
// settings (allowed — extension storage only, never production code). Call from a
// privileged extension page (dashboard/popup) BEFORE navigating/reloading the view.
export async function enableRavepage(page: Page): Promise<void> {
  await page.evaluate(() => chrome.storage.local.set({ settings: { experimental: { ravepage: true } } }));
}

// Open (and settle) a platform tab pointed at its entry URL. Requires the
// platform to be mocked first.
export async function openPlatformTab(context: BrowserContext, platform: MockPlatform): Promise<Page> {
  const page = await context.newPage();
  await page.goto(PLATFORM_ENTRY[platform], { waitUntil: 'load' });
  return page;
}

// Route a platform's origin(s) to local fixtures. Register before opening tabs.
export async function mockPlatform(
  context: BrowserContext,
  platform: MockPlatform,
  variant: MockVariant,
): Promise<void> {
  const loggedIn = variant === 'logged-in';
  if (platform === 'vrcpop') {
    await context.route('https://vrcpop.com/**', (route) => {
      const u = new URL(route.request().url());
      if (u.pathname.startsWith('/api/')) {
        return route.fulfill({
          status: loggedIn ? 200 : 401,
          contentType: 'application/json',
          body: JSON.stringify(loggedIn ? { success: true, likes: { djs: [], clubs: [], events: [] }, rsvps: [] } : { success: false }),
        });
      }
      return route.fulfill({ contentType: 'text/html', body: fill(mock('vrcpop.html'), loggedIn) });
    });
    return;
  }
  if (platform === 'vrctl') {
    await context.route('https://vrc.tl/**', (route) => {
      const u = new URL(route.request().url());
      // Never fulfill with a 3xx: Chromium follows mocked redirects to the REAL
      // network (observed in P5). Serve the sign-in page in place; the agent's
      // detector treats "no grid marker" as logged-out.
      if (!loggedIn && u.pathname.startsWith('/admin/')) {
        return route.fulfill({ contentType: 'text/html', body: mock('vrctl-signin.html') });
      }
      if (u.pathname.startsWith('/sign/')) {
        return route.fulfill({ contentType: 'text/html', body: mock('vrctl-signin.html') });
      }
      return route.fulfill({ contentType: 'text/html', body: mock('vrctl-grid.html') });
    });
    return;
  }
  await context.route('https://development.rave.page/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: fill(mock('ravepage.html'), loggedIn) }),
  );
  await context.route('https://development.api.rave.page/**', (route) =>
    route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'not found' }) }),
  );
}
