import { beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { ensureAgent } from '../../src/runtime/tabs';
import { isBridgeError } from '../../src/core/errors';
import { createFake, type Fake } from './fake-ext';

async function codeOf(p: Promise<unknown>): Promise<string> {
  try {
    await p;
    return 'NO_THROW';
  } catch (e) {
    return isBridgeError(e) ? e.code : `OTHER:${String(e)}`;
  }
}

let f: Fake;
beforeEach(() => {
  f = createFake();
  h.ext = f.ext;
});

describe('ensureAgent', () => {
  it('prefers an existing complete+active tab, injects once, opens nothing', async () => {
    f = createFake({
      pingBuildIds: ['test'],
      tabs: [
        { id: 1, url: 'https://vrcpop.com/dashboard', status: 'complete', active: false },
        { id: 2, url: 'https://vrcpop.com/x', status: 'complete', active: true },
      ],
    });
    h.ext = f.ext;
    const r = await ensureAgent('vrcpop', { allowOpen: false });
    expect(r).toEqual({ tabId: 2, opened: false });
    expect(f.calls.created).toHaveLength(0);
    expect(f.calls.executeScriptTargets).toEqual([2]);
    expect(f.calls.reloads).toEqual([]);
  });

  it('with no tab and allowOpen:false -> AGENT_UNAVAILABLE', async () => {
    f = createFake({ tabs: [] });
    h.ext = f.ext;
    expect(await codeOf(ensureAgent('vrcpop', { allowOpen: false }))).toBe('AGENT_UNAVAILABLE');
    expect(f.calls.created).toHaveLength(0);
  });

  it('with no tab and allowOpen:true -> creates an INACTIVE tab at the entry URL', async () => {
    f = createFake({ tabs: [], pingBuildIds: ['test'] });
    h.ext = f.ext;
    const r = await ensureAgent('vrcpop', { allowOpen: true });
    expect(r.opened).toBe(true);
    expect(f.calls.created).toHaveLength(1);
    expect(f.calls.created[0]?.active).toBe(false);
    expect(f.calls.created[0]?.url).toBe('https://vrcpop.com/dashboard');
  });

  it('missing host permission -> PERMISSION_MISSING', async () => {
    f = createFake({ contains: false });
    h.ext = f.ext;
    expect(await codeOf(ensureAgent('vrctl', { allowOpen: true }))).toBe('PERMISSION_MISSING');
  });

  it('stale agent buildId -> reload + re-inject exactly once', async () => {
    f = createFake({
      pingBuildIds: ['stale', 'test'],
      tabs: [{ id: 5, url: 'https://vrcpop.com/dashboard', status: 'complete', active: true }],
    });
    h.ext = f.ext;
    const r = await ensureAgent('vrcpop', { allowOpen: false });
    expect(r.tabId).toBe(5);
    expect(f.calls.reloads).toEqual([5]);
    expect(f.calls.executeScriptTargets).toEqual([5, 5]);
  });

  it('persistently stale agent -> AGENT_UNAVAILABLE after one reload', async () => {
    f = createFake({
      pingBuildIds: ['stale', 'stale'],
      tabs: [{ id: 6, url: 'https://vrcpop.com/dashboard', status: 'complete', active: true }],
    });
    h.ext = f.ext;
    expect(await codeOf(ensureAgent('vrcpop', { allowOpen: false }))).toBe('AGENT_UNAVAILABLE');
    expect(f.calls.reloads).toEqual([6]);
  });
});
