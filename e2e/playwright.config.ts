import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  // The opt-in documentation generator is not a skipped release gate.
  testIgnore: process.env.EB_SCREENSHOTS === '1' ? [] : ['**/readme-screenshots.spec.ts'],
  workers: 1,
  fullyParallel: false,
  timeout: 60_000,
  reporter: 'list',
  use: { trace: 'retain-on-failure' },
});
