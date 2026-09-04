import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve('src/ui/styles.css'), 'utf8');

describe('styles.css themes the @rave-page/ui kit with a neutral palette', () => {
  it('imports the kit design tokens', () => {
    expect(css).toContain('@import "@rave-page/ui/tokens.css"');
  });

  it('adds an @theme override that re-skins the brand tokens to neutral teal', () => {
    expect(css).toContain('@theme');
    expect(css).toContain('--color-brand-base:        #14B8A6');
    expect(css).toContain('--color-brand-mint:        #22C55E');
    // system font stack, not a bundled display font
    expect(css).toContain('--font-orbitron: ui-sans-serif, system-ui, sans-serif');
  });

  it('ships no Orbitron @font-face / bundled font', () => {
    expect(css).not.toContain('@font-face');
    expect(css).not.toContain('Orbitron');
  });

  it('opts the kit source back into Tailwind scanning (node_modules is auto-ignored)', () => {
    expect(css).toContain('@source "../../node_modules/@rave-page/ui/src"');
  });
});

// The kit >=0.1.1 derives its brand glows from --color-brand-base at runtime
// (shadow-brand-*), so the extension's teal override re-tints them. A kit that
// re-introduces hardcoded rgba(247,8,100)/#f70864 box-shadows would defeat the
// override -> guard the vendored source (build-independent; fresh on install).
describe('vendored @rave-page/ui brand glows are themeable (no hardcoded pink)', () => {
  const kitBase = 'node_modules/@rave-page/ui/src/base';
  const read = (f: string) => readFileSync(resolve(kitBase, f), 'utf8');

  it('Button/Badge/Card use the shadow-brand-* tokens', () => {
    expect(read('Button.tsx')).toContain('shadow-brand-glow');
    expect(read('Badge.tsx')).toContain('shadow-brand-glow-sm');
    expect(read('Card.tsx')).toContain('shadow-brand-ring');
  });

  it('no hardcoded brand pink in the glow components', () => {
    for (const f of ['Button.tsx', 'Badge.tsx', 'Card.tsx']) {
      const src = read(f);
      expect(src).not.toMatch(/247, ?8, ?100/);
      expect(src.toLowerCase()).not.toContain('f70864');
    }
  });

  it('tokens.css defines --shadow-brand-* via color-mix off --color-brand-base', () => {
    const tokens = readFileSync(resolve('node_modules/@rave-page/ui/src/styles/tokens.css'), 'utf8');
    expect(tokens).toMatch(/--shadow-brand-glow:\s*[^;]*color-mix\(in srgb, var\(--color-brand-base\)/);
    expect(tokens).toContain('--shadow-brand-glow-sm:');
    expect(tokens).toContain('--shadow-brand-ring:');
  });
});
