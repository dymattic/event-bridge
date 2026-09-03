import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve('src/ui/styles.css'), 'utf8');

describe('styles.css consumes the @rave-page/ui kit', () => {
  it('no longer defines the brand palette locally (tokens.css owns it)', () => {
    expect(css).not.toContain('--color-brand-base');
  });

  it('imports the kit design tokens', () => {
    expect(css).toContain('@import "@rave-page/ui/tokens.css"');
  });

  it('opts the kit source back into Tailwind scanning (node_modules is auto-ignored)', () => {
    expect(css).toContain('@source "../../node_modules/@rave-page/ui/src"');
  });
});
