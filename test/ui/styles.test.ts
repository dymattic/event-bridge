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
