// Safety invariant: the vrcpop adapter never calls a raw HTTP client. ALL network
// goes through the agent `http` op inside the user's own tab (cookies + CSRF).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(process.cwd(), 'src', 'adapters', 'vrcpop');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

const FORBIDDEN: RegExp[] = [/\bfetch\s*\(/, /XMLHttpRequest/, /navigator\.sendBeacon/, /new\s+WebSocket/, /EventSource/];

describe('vrcpop adapter uses no raw HTTP client', () => {
  for (const file of walk(ROOT)) {
    it(`clean: ${file.slice(ROOT.length + 1)}`, () => {
      const text = readFileSync(file, 'utf8');
      for (const re of FORBIDDEN) {
        expect(re.test(text), `${re} present in ${file}`).toBe(false);
      }
    });
  }
});
