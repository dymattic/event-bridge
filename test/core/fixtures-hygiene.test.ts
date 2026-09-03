import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const FIXTURES = join(process.cwd(), 'test', 'fixtures');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// Public-repo hygiene: sanitized fixtures must never leak real recon values.
const FORBIDDEN: Array<{ label: string; re: RegExp }> = [
  { label: 'real group id (grp_699d…)', re: /grp_699d/ },
  { label: 'organizer id 852 (standalone)', re: /\b852\b/ },
  { label: '64-hex CSRF-like string', re: /\b[0-9a-f]{64}\b/ },
  { label: 'name "DyMension"', re: /DyMension/ },
  { label: 'name "DyMattic"', re: /DyMattic/ },
  { label: 'discord/cdn avatar URL', re: /discordapp|cdn\./i },
];

describe('fixtures hygiene', () => {
  const files = walk(FIXTURES);

  it('finds fixture files', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of walk(FIXTURES)) {
    it(`clean: ${file.slice(FIXTURES.length + 1)}`, () => {
      const text = readFileSync(file, 'utf8');
      for (const { label, re } of FORBIDDEN) {
        const m = re.exec(text);
        expect(m, `${label} present: ${m?.[0] ?? ''}`).toBeNull();
      }
    });
  }
});
