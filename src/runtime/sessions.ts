// Passive per-platform session status for popup/dashboard. NEVER opens a tab
// (allowOpen:false) — only a user-triggered action may pass allowOpen:true.
import { isBridgeError, type BridgeErrorCode } from '../core/errors';
import type { Platform, SessionInfo } from '../shared/agent-protocol';
import { ensureAgent } from './tabs';
import { callAgent } from './agent-transport';
import { getStored } from '../adapters/ravepage/token-store';

export type SessionState = 'no-permission' | 'no-tab' | 'logged-out' | 'logged-in' | 'error';

export interface SessionStatus {
  state: SessionState;
  info?: SessionInfo;
  error?: { code: BridgeErrorCode; message: string };
}

// rave.page status derives from the extension token store (a connect gesture),
// NOT from a page session — no tab is opened. logged-out = "not connected".
async function ravepageStatus(): Promise<SessionStatus> {
  const a = await getStored();
  const exp = a ? Date.parse(a.exp) : NaN;
  if (a && Number.isFinite(exp) && exp > Date.now()) {
    return { state: 'logged-in', info: { loggedIn: true, label: a.label || undefined, expiresAt: a.exp } };
  }
  return { state: 'logged-out', info: { loggedIn: false } };
}

export async function getSessionStatus(platform: Platform): Promise<SessionStatus> {
  if (platform === 'ravepage') return ravepageStatus();
  let tabId: number;
  try {
    ({ tabId } = await ensureAgent(platform, { allowOpen: false }));
  } catch (e) {
    if (isBridgeError(e)) {
      if (e.code === 'PERMISSION_MISSING') return { state: 'no-permission', error: { code: e.code, message: e.message } };
      if (e.code === 'AGENT_UNAVAILABLE') return { state: 'no-tab', error: { code: e.code, message: e.message } };
      return { state: 'error', error: { code: e.code, message: e.message } };
    }
    return { state: 'error', error: { code: 'UNKNOWN', message: e instanceof Error ? e.message : String(e) } };
  }
  try {
    const info = await callAgent(tabId, { op: 'session' });
    return { state: info.loggedIn ? 'logged-in' : 'logged-out', info };
  } catch (e) {
    return {
      state: 'error',
      error: {
        code: isBridgeError(e) ? e.code : 'UNKNOWN',
        message: e instanceof Error ? e.message : String(e),
      },
    };
  }
}
