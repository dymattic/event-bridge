import { beforeEach, describe, expect, it, vi } from 'vitest';

// connect() wiring: agent grant -> exchange -> decode exp -> store -> /auth/me.
// The in-browser grant hop is covered by the e2e handshake + grant.test.ts; here
// we mock the transport + generated calls and assert the exchange/store logic.
const h = vi.hoisted(() => ({
  ext: undefined as unknown,
  grant: { code: 'C', api: 'https://development.api.rave.page' } as { code: string; api: string },
}));
vi.mock('../../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));
vi.mock('../../../src/runtime/tabs', () => ({ ensureAgent: async () => ({ tabId: 7, opened: true }) }));
vi.mock('../../../src/runtime/agent-transport', () => ({ callAgent: async () => h.grant }));
vi.mock('../../../src/adapters/ravepage/routes', () => {
  const exp = Math.floor(Date.now() / 1000) + 30 * 86_400;
  const b64u = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const token = `${b64u({ alg: 'none' })}.${b64u({ exp })}.sig`;
  return {
    ROUTES: {
      exchangeDesktopGrant: async () => ({ token, refresh: 'SECRET_REFRESH' }),
      getCurrentUser: async () => ({ id: 'usr_1', display_name: 'Example DJ', username: 'dj' }),
    },
  };
});

import { connect, disconnect, status } from '../../../src/adapters/ravepage/auth';
import { getStored } from '../../../src/adapters/ravepage/token-store';

type Listener = (c: Record<string, unknown>, a: string) => void;
function makeExt() {
  const store: Record<string, unknown> = {};
  const ls = new Set<Listener>();
  return {
    storage: {
      local: {
        get: async (k: string) => (k in store ? { [k]: store[k] } : {}),
        set: async (o: Record<string, unknown>) => { Object.assign(store, o); },
        remove: async (k: string) => { delete store[k]; },
      },
      onChanged: { addListener: (l: Listener) => ls.add(l), removeListener: (l: Listener) => ls.delete(l) },
    },
  };
}

beforeEach(() => {
  h.ext = makeExt();
  h.grant = { code: 'C', api: 'https://development.api.rave.page' };
});

describe('auth.connect', () => {
  it('exchanges the grant, stores the token + identity, and returns connected', async () => {
    const s = await connect();
    expect(s.connected).toBe(true);
    expect(s.userId).toBe('usr_1');
    expect(s.label).toBe('Example DJ');
    expect(s.reconnectSoon).toBe(false);
  });

  it('never persists the exchange refresh token', async () => {
    await connect();
    const stored = await getStored();
    expect(stored?.token).toBeTruthy();
    expect(stored as object).not.toHaveProperty('refresh');
    expect(JSON.stringify(stored)).not.toContain('SECRET_REFRESH');
  });

  it('rejects UNSUPPORTED when the grant is for a different API base', async () => {
    h.grant = { code: 'C', api: 'https://wrong-base.example' };
    await expect(connect()).rejects.toMatchObject({ code: 'UNSUPPORTED' });
  });

  it('status reflects the store; disconnect clears it', async () => {
    await connect();
    expect((await status()).connected).toBe(true);
    await disconnect();
    expect((await status()).connected).toBe(false);
  });
});
