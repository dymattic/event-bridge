// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TooltipProvider } from '@rave-page/ui';
import type { PosterFile, PosterRef } from '../../src/core/schema';
import { PosterPanel } from '../../src/ui/dashboard/components/PosterPanel';

let container: HTMLElement;
let root: Root;
const emits: { poster: PosterRef | null; file: PosterFile | null }[] = [];

async function render(): Promise<void> {
  await act(async () => {
    root.render(
      <TooltipProvider>
        <PosterPanel value={null} file={null} onChange={(poster, file) => emits.push({ poster, file })} />
      </TooltipProvider>,
    );
  });
}

function setInputValue(el: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

beforeEach(() => {
  emits.length = 0;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('PosterPanel', () => {
  it('emits a url PosterRef when a URL is entered', async () => {
    await render();
    const input = container.querySelector('[data-testid="poster-url"]') as HTMLInputElement;
    await act(async () => {
      setInputValue(input, 'https://example.test/p.png');
    });
    expect(emits.at(-1)?.poster).toEqual({ kind: 'url', url: 'https://example.test/p.png' });
    expect(emits.at(-1)?.file).toBeNull();
  });

  it('warns and rejects a file larger than 8 MB', async () => {
    await render();
    const file = new File(['x'], 'big.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 9 * 1024 * 1024 });
    const input = container.querySelector('[data-testid="poster-file"]') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    await act(async () => {
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(container.querySelector('[data-testid="poster-warning"]')).toBeTruthy();
    expect(emits.some((e) => e.file !== null)).toBe(false); // oversized file not accepted
  });
});
