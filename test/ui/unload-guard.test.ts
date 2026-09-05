import { afterEach, describe, expect, it, vi } from 'vitest';
import { activeRunCount, beginRun, endRun, withRunGuard } from '../../src/ui/dashboard/lib/unload-guard';

afterEach(() => {
  while (activeRunCount() > 0) endRun(); // keep the shared counter balanced across tests
  vi.restoreAllMocks();
});

describe('unload guard', () => {
  it('ref-counts begin/end and installs exactly one beforeunload listener', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const beforeunloadAdds = () => add.mock.calls.filter((c) => c[0] === 'beforeunload').length;
    const beforeunloadRemoves = () => remove.mock.calls.filter((c) => c[0] === 'beforeunload').length;

    expect(activeRunCount()).toBe(0);
    beginRun();
    expect(activeRunCount()).toBe(1);
    expect(beforeunloadAdds()).toBe(1);
    beginRun();
    expect(activeRunCount()).toBe(2);
    expect(beforeunloadAdds()).toBe(1); // still only one listener for nested runs
    endRun();
    expect(activeRunCount()).toBe(1);
    expect(beforeunloadRemoves()).toBe(0); // not yet — a run is still active
    endRun();
    expect(activeRunCount()).toBe(0);
    expect(beforeunloadRemoves()).toBe(1);
  });

  it('withRunGuard holds the guard during fn and releases it after', async () => {
    let during = 0;
    await withRunGuard(async () => {
      during = activeRunCount();
    });
    expect(during).toBe(1);
    expect(activeRunCount()).toBe(0);
  });

  it('withRunGuard releases the guard even when fn throws', async () => {
    await expect(withRunGuard(async () => Promise.reject(new Error('boom')))).rejects.toThrow('boom');
    expect(activeRunCount()).toBe(0);
  });

  it('never goes negative on an unbalanced end', () => {
    endRun();
    expect(activeRunCount()).toBe(0);
  });
});
