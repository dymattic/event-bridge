// Agent-side rave.page desktop-grant handshake with the /desktop/bridge page.
// Runs inside the injected content script; allowed ONLY on the rave.page dev
// origin. Message contract (P3):
//   page  -> agent : {type:'rave-page:bridge-ready', version:1}   (repeats ~1s)
//   agent -> page  : {type:'event-bridge:hello', extensionName:'event-bridge',
//                     version: BUILD_ID}
//   page  -> agent : {type:'rave-page:desktop-grant', version:1, code, api}
// The agent posts hello once immediately on op start (the page may already be
// waiting) and again on every bridge-ready. Only same-window, same-origin events
// are accepted. Rejects TIMEOUT after timeoutMs. Listeners removed on settle.
import { BUILD_ID } from '../shared/build-id';
import { BridgeError } from '../core/errors';
import { ORIGINS, type GrantResult } from '../shared/agent-protocol';

const HELLO = {
  type: 'event-bridge:hello',
  extensionName: 'event-bridge',
  version: BUILD_ID,
} as const;

interface DesktopGrantMsg {
  type: 'rave-page:desktop-grant';
  version?: number;
  code: string;
  api: string;
}

function isBridgeReady(d: unknown): boolean {
  return typeof d === 'object' && d !== null && (d as { type?: unknown }).type === 'rave-page:bridge-ready';
}

function isDesktopGrant(d: unknown): d is DesktopGrantMsg {
  if (typeof d !== 'object' || d === null) return false;
  const m = d as Record<string, unknown>;
  return m.type === 'rave-page:desktop-grant' && typeof m.code === 'string' && typeof m.api === 'string';
}

export function awaitGrant(timeoutMs: number): Promise<GrantResult> {
  if (location.origin !== ORIGINS.ravepage) {
    return Promise.reject(new BridgeError('UNSUPPORTED', `grantAwait only on ${ORIGINS.ravepage}`));
  }
  return new Promise<GrantResult>((resolve, reject) => {
    const hello = (): void => window.postMessage(HELLO, location.origin);
    const settle = (fn: () => void): void => {
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      fn();
    };
    const onMessage = (e: MessageEvent): void => {
      if (e.source !== window || e.origin !== location.origin) return; // same-window, same-origin only
      const data: unknown = e.data;
      if (isBridgeReady(data)) {
        hello();
        return;
      }
      if (isDesktopGrant(data)) settle(() => resolve({ code: data.code, api: data.api }));
    };
    const timer = setTimeout(() => settle(() => reject(new BridgeError('TIMEOUT', 'grant handshake timed out'))), timeoutMs);
    window.addEventListener('message', onMessage);
    hello(); // page may already be waiting
  });
}
