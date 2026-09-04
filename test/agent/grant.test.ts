// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { awaitGrant } from '../../src/agent/ravepage-grant.dom';

const APP = 'https://development.rave.page';
const API = 'https://development.api.rave.page';

function setUrl(u: string): void {
  (window as unknown as { happyDOM: { setURL: (url: string) => void } }).happyDOM.setURL(u);
}

function post(data: unknown, origin: string = location.origin): void {
  window.dispatchEvent(new MessageEvent('message', { data, origin, source: window }));
}

beforeEach(() => setUrl(`${APP}/desktop/bridge?target=extension`));
afterEach(() => vi.useRealTimers());

describe('awaitGrant', () => {
  it('posts hello on start, replies hello to bridge-ready, resolves on grant', async () => {
    const spy = vi.spyOn(window, 'postMessage');
    const p = awaitGrant(5_000, APP);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'event-bridge:hello', extensionName: 'event-bridge' }),
      location.origin,
    );
    spy.mockClear();
    post({ type: 'rave-page:bridge-ready', version: 1 });
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: 'event-bridge:hello' }), location.origin);
    post({ type: 'rave-page:desktop-grant', version: 1, code: 'C1', api: API });
    await expect(p).resolves.toEqual({ code: 'C1', api: API });
  });

  it('resolves even when the grant arrives before any bridge-ready', async () => {
    const p = awaitGrant(5_000, APP);
    post({ type: 'rave-page:desktop-grant', code: 'C2', api: API });
    await expect(p).resolves.toMatchObject({ code: 'C2' });
  });

  it('ignores wrong-origin grants', async () => {
    const p = awaitGrant(5_000, APP);
    post({ type: 'rave-page:desktop-grant', code: 'EVIL', api: 'x' }, 'https://evil.example');
    post({ type: 'rave-page:desktop-grant', code: 'GOOD', api: API });
    await expect(p).resolves.toMatchObject({ code: 'GOOD' });
  });

  it('rejects TIMEOUT after timeoutMs', async () => {
    vi.useFakeTimers();
    const p = awaitGrant(1_000, APP);
    const assertion = expect(p).rejects.toMatchObject({ code: 'TIMEOUT' });
    await vi.advanceTimersByTimeAsync(1_000);
    await assertion;
  });

  it('rejects UNSUPPORTED when the page origin != the expected instance origin', async () => {
    // Page is on the dev app origin, but the op expects a different (custom) instance.
    await expect(awaitGrant(1_000, 'https://rave.example')).rejects.toMatchObject({ code: 'UNSUPPORTED' });
  });

  it('rejects UNSUPPORTED off the rave.page origin entirely', async () => {
    setUrl('https://vrcpop.com/');
    await expect(awaitGrant(1_000, APP)).rejects.toMatchObject({ code: 'UNSUPPORTED' });
  });
});
