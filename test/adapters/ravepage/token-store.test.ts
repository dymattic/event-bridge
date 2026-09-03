import { beforeEach, describe, expect, it, vi } from 'vitest';

// storage.local fake with get/set/remove/onChanged (fake-ext lacks remove).
const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import {
  clear,
  getStored,
  getValidToken,
  needsReconnect,
  onChange,
  setStored,
  type StoredAuth,
} from '../../../src/adapters/ravepage/token-store';

type Listener = (changes: Record<string, { newValue?: unknown; oldValue?: unknown }>, area: string) => void;

function makeExt() {
  const store: Record<string, unknown> = {};
  const listeners = new Set<Listener>();
  return {
    storage: {
      local: {
        get: async (k: string) => (k in store ? { [k]: store[k] } : {}),
        set: async (o: Record<string, unknown>) => {
          for (const [k, v] of Object.entries(o)) {
            const oldValue = store[k];
            store[k] = v;
            listeners.forEach((l) => l({ [k]: { newValue: v, oldValue } }, 'local'));
          }
        },
        remove: async (k: string) => {
          const oldValue = store[k];
          delete store[k];
          listeners.forEach((l) => l({ [k]: { oldValue } }, 'local'));
        },
      },
      onChanged: {
        addListener: (l: Listener) => listeners.add(l),
        removeListener: (l: Listener) => listeners.delete(l),
      },
    },
  };
}

const iso = (msFromNow: number): string => new Date(Date.now() + msFromNow).toISOString();
const auth = (exp: string): StoredAuth => ({ apiBase: 'https://development.api.rave.page', token: 't', exp, userId: 'usr_1', label: 'DJ', obtainedAt: iso(0) });

beforeEach(() => {
  h.ext = makeExt();
});

describe('token-store', () => {
  it('getStored is null when empty', async () => {
    expect(await getStored()).toBeNull();
  });

  it('round-trips a stored auth', async () => {
    const a = auth(iso(10 * 86_400_000));
    await setStored(a);
    expect(await getStored()).toEqual(a);
  });

  it('getValidToken returns the token when unexpired, null when expired', async () => {
    await setStored(auth(iso(3600_000)));
    expect(await getValidToken()).toBe('t');
    await setStored(auth(iso(-10_000)));
    expect(await getValidToken()).toBeNull();
  });

  it('needsReconnect: true with no token, true within 3d, false beyond 3d', async () => {
    expect(await needsReconnect()).toBe(true);
    await setStored(auth(iso(2 * 86_400_000)));
    expect(await needsReconnect()).toBe(true);
    await setStored(auth(iso(10 * 86_400_000)));
    expect(await needsReconnect()).toBe(false);
  });

  it('clear removes the stored auth', async () => {
    await setStored(auth(iso(86_400_000)));
    await clear();
    expect(await getStored()).toBeNull();
  });

  it('onChange fires on write and stops after unsubscribe', async () => {
    const seen: (StoredAuth | null)[] = [];
    const off = onChange((a) => seen.push(a));
    await setStored(auth(iso(86_400_000)));
    expect(seen).toHaveLength(1);
    expect(seen[0]?.token).toBe('t');
    off();
    await clear();
    expect(seen).toHaveLength(1);
  });
});
