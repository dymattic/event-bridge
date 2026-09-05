// Drift guard: docs/screenshots/ holds EXACTLY the files the README + docs link
// to, so a renamed/added/removed capture (or a stray file) fails here instead of
// leaving a broken image link on GitHub. Regenerate with `pnpm screenshots`.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const EXPECTED = [
  '01-overview.png',
  '02-events.png',
  '03-editor-basics.png',
  '04-editor-lineup.png',
  '05-editor-review.png',
  '06-sync-sheet.png',
  '07-jobs.png',
  '08-settings.png',
  '09-clubs.png',
  '10-popup.png',
].sort();

const dir = join(process.cwd(), 'docs', 'screenshots');

describe('docs/screenshots manifest', () => {
  it('contains exactly the expected screenshot files', () => {
    const found = readdirSync(dir).sort();
    expect(found).toEqual(EXPECTED);
  });
});
