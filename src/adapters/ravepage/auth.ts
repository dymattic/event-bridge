// rave.page connect/disconnect/status. Auth = rave-mate's grant/exchange flow,
// minted by the SPA on the /desktop/bridge page (the extension NEVER reads SPA
// tokens). connect():
//   ensureAgent(bridge tab, ACTIVE) -> agent op grantAwait -> {code, api}
//   -> POST /auth/exchange {code} -> {token, refresh}   (refresh DISCARDED)
//   -> decode JWT exp (unverified) -> store -> GET /auth/me -> identity.
// No refresh (/auth/refresh is 410) -> renewal = a user re-connect gesture.
import { BridgeError } from '../../core/errors';
import { ORIGINS } from '../../shared/agent-protocol';
import { ensureAgent } from '../../runtime/tabs';
import { callAgent } from '../../runtime/agent-transport';
import type { ConnectionStatus } from '../types';
import { API_BASE, toBridgeError } from './client';
import { ROUTES } from './routes';
import { clear, getStored, RECONNECT_WINDOW_MS, setStored, type StoredAuth } from './token-store';

const BRIDGE_URL = `${ORIGINS.ravepage}/desktop/bridge?target=extension`;
const GRANT_TIMEOUT_MS = 180_000;

// Unverified base64url decode of the JWT `exp` (seconds) -> ISO string.
function decodeExpIso(token: string): string {
  const seg = token.split('.')[1];
  if (!seg) throw new BridgeError('VALIDATION', 'exchange token has no payload');
  let b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  let exp: unknown;
  try {
    exp = (JSON.parse(atob(b64)) as { exp?: unknown }).exp;
  } catch {
    throw new BridgeError('VALIDATION', 'exchange token payload not decodable');
  }
  if (typeof exp !== 'number') throw new BridgeError('VALIDATION', 'exchange token missing exp');
  return new Date(exp * 1000).toISOString();
}

function statusFrom(a: StoredAuth | null, now: number): ConnectionStatus {
  if (!a) return { connected: false, reconnectSoon: false };
  const exp = Date.parse(a.exp);
  if (!Number.isFinite(exp) || exp <= now) return { connected: false, reconnectSoon: true };
  return {
    connected: true,
    userId: a.userId || undefined,
    label: a.label || undefined,
    expiresAt: a.exp,
    reconnectSoon: exp - now < RECONNECT_WINDOW_MS,
  };
}

// User-triggered ONLY. Opens the bridge page active, awaits the grant, exchanges
// it, stores the token, and reads identity.
export async function connect(): Promise<ConnectionStatus> {
  const { tabId } = await ensureAgent('ravepage', { allowOpen: true, url: BRIDGE_URL, active: true });
  const grant = await callAgent(
    tabId,
    { op: 'grantAwait', timeoutMs: GRANT_TIMEOUT_MS },
    { timeoutMs: GRANT_TIMEOUT_MS + 5_000 },
  );
  if (grant.api !== API_BASE) {
    throw new BridgeError('UNSUPPORTED', `grant is for ${grant.api}, expected ${API_BASE}`);
  }
  try {
    const exchanged = await ROUTES.exchangeDesktopGrant({ requestBody: { code: grant.code } });
    const token = exchanged.token;
    if (!token) throw new BridgeError('VALIDATION', 'exchange returned no token');
    // exchanged.refresh intentionally discarded — never persisted.
    const expIso = decodeExpIso(token);
    // Store BEFORE /auth/me so the Bearer resolver can read the token.
    const base: StoredAuth = { apiBase: API_BASE, token, exp: expIso, userId: '', label: '', obtainedAt: new Date().toISOString() };
    await setStored(base);
    const me = await ROUTES.getCurrentUser();
    const userId = me.id ?? '';
    const label = me.display_name || me.username || userId;
    await setStored({ ...base, userId, label });
    return statusFrom({ ...base, userId, label }, Date.now());
  } catch (e) {
    throw toBridgeError(e);
  }
}

export async function disconnect(): Promise<void> {
  await clear();
}

export async function status(now: number = Date.now()): Promise<ConnectionStatus> {
  return statusFrom(await getStored(), now);
}

// Re-fetch identity from /auth/me (dev panel "Who am I").
export async function whoAmI(): Promise<{ userId: string; label: string }> {
  try {
    const me = await ROUTES.getCurrentUser();
    const userId = me.id ?? '';
    const label = me.display_name || me.username || userId;
    const cur = await getStored();
    if (cur) await setStored({ ...cur, userId, label });
    return { userId, label };
  } catch (e) {
    throw toBridgeError(e);
  }
}
