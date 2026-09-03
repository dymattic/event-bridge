// Enforces the adapter's raw-fetch discipline: every generated call goes through
// routes.ts; the only raw fetch( is the chunk PUT, which must carry the
// `// raw-fetch-allowed:` marker on its line. Greps src/adapters/ravepage/*.ts
// (top-level only — the api-client/ subdir is generated and excluded).
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const adapterDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../src/adapters/ravepage');

describe('rave.page raw-fetch discipline', () => {
  it('no raw fetch( in adapter sources unless the line is marked raw-fetch-allowed:', () => {
    const files = readdirSync(adapterDir).filter((f) => f.endsWith('.ts')); // excludes api-client/ (a dir)
    const offenders: string[] = [];
    for (const f of files) {
      readFileSync(join(adapterDir, f), 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/fetch\(/.test(line) && !/raw-fetch-allowed:/.test(line)) offenders.push(`${f}:${i + 1}`);
        });
    }
    expect(offenders).toEqual([]);
  });

  it('the one allowed raw fetch is the chunk PUT in upload.ts', () => {
    const upload = readFileSync(join(adapterDir, 'upload.ts'), 'utf8');
    const allowed = upload.split('\n').filter((l) => /fetch\(/.test(l));
    expect(allowed).toHaveLength(1);
    expect(allowed[0]).toMatch(/raw-fetch-allowed:/);
  });
});
