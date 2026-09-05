// Regenerate the README screenshots under docs/screenshots/ from the e2e mocks
// (NEVER real sessions). Builds the extension, then runs ONLY the screenshot spec
// with EB_SCREENSHOTS=1 so the images are written (the normal `pnpm e2e` run
// leaves the spec skipped). Every capture comes from the mocked test platforms —
// see docs/development.md. The env is set on the child process (Windows-safe; no
// shell `VAR=x` prefix).
import { execSync } from 'node:child_process';

const run = (cmd, extraEnv = {}) => execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...extraEnv } });

console.log('screenshots: building extension…');
run('pnpm build');

console.log('screenshots: capturing (EB_SCREENSHOTS=1)…');
run('pnpm exec playwright test -c e2e/playwright.config.ts e2e/tests/readme-screenshots.spec.ts', { EB_SCREENSHOTS: '1' });

console.log('screenshots: done → docs/screenshots/');
