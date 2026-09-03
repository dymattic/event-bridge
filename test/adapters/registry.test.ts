import { describe, expect, it, vi } from 'vitest';

// The vrcpop/vrctl platform adapters import the webext runtime at module load;
// mock the shim so the registry (and its adapters) import cleanly in vitest. We
// only assert interface shape here — no adapter method is invoked.
vi.mock('../../src/shared/webext', () => ({ ext: undefined }));

import { ADAPTER_IDS, getAdapter, hasAdapter } from '../../src/adapters/registry';
import type { PlatformAdapter } from '../../src/adapters/types';

const METHODS: (keyof PlatformAdapter)[] = [
  'session',
  'listOwnClubs',
  'listOwnEvents',
  'readEvent',
  'loadVocab',
  'resolvePerformer',
  'planCreate',
  'planUpdate',
  'planDelete',
  'planPoster',
  'execute',
  'setPoster',
  'removePoster',
];

describe('adapter registry', () => {
  it('registers all three platforms', () => {
    expect([...ADAPTER_IDS].sort()).toEqual(['ravepage', 'vrcpop', 'vrctl']);
  });

  it.each([...ADAPTER_IDS])('%s exposes the full PlatformAdapter interface with a matching id', (id) => {
    const a = getAdapter(id);
    expect(a.id).toBe(id);
    expect(a.caps).toBeDefined();
    expect(a.caps.platform).toBe(id);
    for (const m of METHODS) expect(typeof a[m], `${id}.${m}`).toBe('function');
    expect(hasAdapter(id)).toBe(true);
  });

  it('throws UNSUPPORTED for an unknown adapter id', () => {
    expect(() => getAdapter('nope' as (typeof ADAPTER_IDS)[number])).toThrowError(/no adapter registered/);
  });
});
