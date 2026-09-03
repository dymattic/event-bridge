import { describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { callAgent } from '../../src/runtime/agent-transport';
import { isBridgeError } from '../../src/core/errors';
import { createFake, type FakePort } from './fake-ext';

// Port that answers postMessage(request) via handler(request) on the next tick.
function loopbackPort(handler: (req: { id: number; op: string }) => unknown): FakePort {
  let onMsg: ((m: unknown) => void) | null = null;
  return {
    name: 'agent',
    onMessage: { addListener: (cb) => (onMsg = cb), removeListener: () => (onMsg = null) },
    onDisconnect: { addListener: () => undefined, removeListener: () => undefined },
    postMessage: (m) => {
      const res = handler(m as { id: number; op: string });
      if (res != null && onMsg) queueMicrotask(() => onMsg?.(res));
    },
    disconnect: () => undefined,
  };
}

describe('callAgent', () => {
  it('resolves the op result over the port', async () => {
    const f = createFake({
      connect: () => loopbackPort((req) => ({ ok: true, id: req.id, op: req.op, result: { loggedIn: true, label: 'user 9001' } })),
    });
    h.ext = f.ext;
    const info = await callAgent(1, { op: 'session' });
    expect(info).toEqual({ loggedIn: true, label: 'user 9001' });
  });

  it('maps an error response to a BridgeError with its code', async () => {
    const f = createFake({
      connect: () => loopbackPort((req) => ({ ok: false, id: req.id, code: 'NOT_LOGGED_IN', message: 'nope' })),
    });
    h.ext = f.ext;
    try {
      await callAgent(2, { op: 'session' });
      throw new Error('should have thrown');
    } catch (e) {
      expect(isBridgeError(e)).toBe(true);
      expect(isBridgeError(e) && e.code).toBe('NOT_LOGGED_IN');
    }
  });

  it('no response within timeout -> TIMEOUT', async () => {
    const f = createFake({ connect: () => loopbackPort(() => null) }); // never answers
    h.ext = f.ext;
    try {
      await callAgent(3, { op: 'session' }, { timeoutMs: 30 });
      throw new Error('should have timed out');
    } catch (e) {
      expect(isBridgeError(e) && e.code).toBe('TIMEOUT');
    }
  });
});
