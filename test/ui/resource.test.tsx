// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearResourceCache, invalidate, useResource, type ResourceResult } from '../../src/ui/lib/resource';

function Probe<T>({ k, loader, ttlMs }: { k: string | null; loader: () => Promise<T>; ttlMs?: number }): React.JSX.Element {
  const r = useResource(k, loader, ttlMs !== undefined ? { ttlMs } : {});
  return <div data-testid="out">{r.loading ? 'loading' : r.error ? `error:${r.error.message}` : `data:${String(r.data)}`}</div>;
}

let container: HTMLElement;
let root: Root;

async function render(node: React.ReactNode): Promise<void> {
  await act(async () => {
    root.render(node);
  });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
}

function text(): string {
  return container.querySelector('[data-testid="out"]')?.textContent ?? '';
}

beforeEach(() => {
  clearResourceCache();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('useResource', () => {
  it('loads and exposes data', async () => {
    await render(<Probe k="a" loader={() => Promise.resolve(42)} />);
    expect(text()).toBe('data:42');
  });

  it('is idle when key is null (no load)', async () => {
    const loader = vi.fn(() => Promise.resolve(1));
    await render(<Probe k={null} loader={loader} />);
    expect(loader).not.toHaveBeenCalled();
    expect(text()).toBe('data:undefined');
  });

  it('dedups concurrent consumers of the same key', async () => {
    const loader = vi.fn(() => Promise.resolve('x'));
    await render(
      <>
        <Probe k="dup" loader={loader} />
        <Probe k="dup" loader={loader} />
      </>,
    );
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('serves a cached fresh value without reloading', async () => {
    const loader = vi.fn(() => Promise.resolve('v'));
    await render(<Probe k="fresh" loader={loader} ttlMs={10_000} />);
    await act(async () => root.unmount());
    root = createRoot(container);
    await render(<Probe k="fresh" loader={loader} ttlMs={10_000} />);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(text()).toBe('data:v');
  });

  it('invalidate(prefix) drops the entry so it reloads', async () => {
    const loader = vi.fn(() => Promise.resolve('v'));
    await render(<Probe k="events:vrcpop" loader={loader} ttlMs={10_000} />);
    invalidate('events:');
    await act(async () => root.unmount());
    root = createRoot(container);
    await render(<Probe k="events:vrcpop" loader={loader} ttlMs={10_000} />);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('captures loader errors', async () => {
    await render(<Probe k="err" loader={() => Promise.reject(new Error('boom'))} />);
    expect(text()).toBe('error:boom');
  });
});

describe('refresh()', () => {
  it('reloads on demand', async () => {
    let n = 0;
    const loader = vi.fn(() => Promise.resolve(++n));
    let latest: ResourceResult<number> | undefined;
    function Ctl(): React.JSX.Element {
      latest = useResource('r', loader, { ttlMs: 10_000 });
      return <div data-testid="out">data:{String(latest.data)}</div>;
    }
    await render(<Ctl />);
    expect(text()).toBe('data:1');
    await act(async () => {
      latest?.refresh();
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(text()).toBe('data:2');
  });
});
