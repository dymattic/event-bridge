// Passive per-platform session status for popup/dashboard. NEVER opens a tab
// (allowOpen:false) — only a user-triggered action may pass allowOpen:true.
import { isBridgeError, type BridgeErrorCode } from '../core/errors';
import type { Platform, SessionInfo } from '../shared/agent-protocol';
import { ensureAgent } from './tabs';
import { callAgent } from './agent-transport';

export type SessionState = 'no-permission' | 'no-tab' | 'logged-out' | 'logged-in' | 'error';

export interface SessionStatus {
  state: SessionState;
  info?: SessionInfo;
  error?: { code: BridgeErrorCode; message: string };
}

export async function getSessionStatus(platform: Platform): Promise<SessionStatus> {
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
