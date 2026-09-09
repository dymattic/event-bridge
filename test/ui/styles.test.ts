import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve('src/ui/styles.css'), 'utf8');

describe('styles.css consumes the @rave-page/ui kit', () => {
  it('imports the kit design tokens', () => {
    expect(css).toContain('@import "@rave-page/ui/tokens.css"');
  });

  it('does not re-theme the brand tokens (kit tokens.css owns them, used as-is)', () => {
    expect(css).not.toContain('@theme');
    expect(css).not.toContain('--color-brand-base');
  });

  it('ships the Orbitron @font-face (dist-relative url)', () => {
    expect(css).toContain('@font-face');
    expect(css).toContain("url('fonts/Orbitron-VariableFont_wght.ttf')");
  });

  it('ships the Inter Variable body face and uses it on body (kit type split)', () => {
    expect(css).toContain("font-family: 'Inter Variable'");
    expect(css).toContain("url('fonts/inter-latin-wght-normal.woff2')");
    // body copy is the Inter/UI face, not the Orbitron display face
    expect(css).toMatch(/body\s*\{[^}]*font-family:\s*var\(--font-body\)/);
  });

  it('opts the in-repo kit source into Tailwind scanning', () => {
    expect(css).toContain('@source "../../packages/ui/src"');
  });
});

// The kit >=0.1.1 derives its brand glows from --color-brand-base at runtime
// (shadow-brand-*), so a consumer re-theming the brand base re-tints them. A kit
// that re-introduces hardcoded rgba(247,8,100)/#f70864 box-shadows would defeat
// that -> guard the vendored source (build-independent; fresh on install). This
// guards the kit contract, not the extension's theme (which is the kit as-is).
describe('vendored @rave-page/ui brand glows are themeable (no hardcoded pink)', () => {
  const kitBase = 'packages/ui/src/base';
  const read = (f: string) => readFileSync(resolve(kitBase, f), 'utf8');
  // Strip comments: an AA-contrast annotation may cite the hex for documentation;
  // the guard is about hardcoded pink in actual styles, not in prose.
  const code = (src: string) => src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

  it('Button/Badge/Card use the shadow-brand-* tokens', () => {
    expect(read('Button.tsx')).toContain('shadow-brand-glow');
    expect(read('Badge.tsx')).toContain('shadow-brand-glow-sm');
    expect(read('Card.tsx')).toContain('shadow-brand-ring');
  });

  it('no hardcoded brand pink in the glow components', () => {
    for (const f of ['Button.tsx', 'Badge.tsx', 'Card.tsx']) {
      const src = code(read(f));
      expect(src).not.toMatch(/247, ?8, ?100/);
      expect(src.toLowerCase()).not.toContain('f70864');
    }
  });

  it('tokens.css defines --shadow-brand-* via color-mix off --color-brand-base', () => {
    const tokens = readFileSync(resolve('packages/ui/src/styles/tokens.css'), 'utf8');
    expect(tokens).toMatch(/--shadow-brand-glow:\s*[^;]*color-mix\(in srgb, var\(--color-brand-base\)/);
    expect(tokens).toContain('--shadow-brand-glow-sm:');
    expect(tokens).toContain('--shadow-brand-ring:');
  });
});
