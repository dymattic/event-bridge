// Manual-verification browser: build, then launch a headed Chromium with the
// unpacked extension loaded into a persistent `.profile` (git-ignored) and the
// remote-debugging port open. The user logs in themselves; the lead attaches
// tooling (Playwright/CDP) via http://127.0.0.1:9222. Stays alive until Ctrl+C.
//
//   pnpm dev:browser
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distChrome = resolve(root, 'dist', 'chrome');
const profileDir = resolve(root, '.profile');
const DEBUG_PORT = 9222;

function build() {
  console.log('building dist/chrome …');
  execFileSync(process.execPath, [resolve(root, 'tools', 'build.mjs')], { stdio: 'inherit', cwd: root });
  execFileSync(process.execPath, [resolve(root, 'tools', 'assemble.mjs')], { stdio: 'inherit', cwd: root });
}

async function extensionId(context) {
  let [sw] = context.serviceWorkers();
  sw ??= await context.waitForEvent('serviceworker');
  return new URL(sw.url()).host;
}

async function main() {
  build();
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    channel: 'chromium',
    args: [
      `--disable-extensions-except=${distChrome}`,
      `--load-extension=${distChrome}`,
      `--remote-debugging-port=${DEBUG_PORT}`,
    ],
    viewport: null,
  });

  const id = await extensionId(context);
  const dashboardUrl = `chrome-extension://${id}/dashboard.html`;
  console.log('\nextension id :', id);
  console.log('dashboard    :', dashboardUrl);
  console.log('debug port   : http://127.0.0.1:' + DEBUG_PORT);
  console.log('profile      :', profileDir, '(git-ignored)');
  console.log('\nLog in on development.rave.page yourself. Ctrl+C to quit.\n');

  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto(dashboardUrl);

  const shutdown = async () => {
    await context.close().catch(() => undefined);
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  context.on('close', () => process.exit(0));
  await new Promise(() => {}); // stay alive until a signal
}

main().catch((e) => {
  console.error('dev-browser failed:', e?.stack || e);
  process.exit(1);
});
