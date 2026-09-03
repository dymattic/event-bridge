// Extension-owned rave.page auth token, in `storage.local` under `ravepage.auth`.
// The exchange returns {token, refresh}; the `refresh` value is DISCARDED and
// never persisted (/auth/refresh is 410 — renewal is a user re-connect). This
// store NEVER reads the SPA's page localStorage tokens.
import { ext } from '../../shared/webext';

export interface StoredAuth {
  apiBase: string;
  token: string;
  exp: string; // ISO 8601 (from the JWT `exp`)
  userId: string;
  label: string;
  obtainedAt: string; // ISO 8601
}

const KEY = 'ravepage.auth';
export const RECONNECT_WINDOW_MS = 3 * 24 * 60 * 60 * 1000; // reconnect when < 3 days left

function isStoredAuth(v: unknown): v is StoredAuth {
  if (typeof v !== 'object' || v === null) return false;
  const a = v as Record<string, unknown>;
  return typeof a.token === 'string' && typeof a.exp === 'string' && typeof a.apiBase === 'string';
}

export async function getStored(): Promise<StoredAuth | null> {
  const got = await ext.storage.local.get(KEY);
  const v = got[KEY];
  return isStoredAuth(v) ? v : null;
}

export async function setStored(a: StoredAuth): Promise<void> {
  await ext.storage.local.set({ [KEY]: a });
}

export async function clear(): Promise<void> {
  await ext.storage.local.remove(KEY);
}

// The token string iff a non-expired token is stored, else null.
export async function getValidToken(now: number = Date.now()): Promise<string | null> {
  const a = await getStored();
  if (!a) return null;
  const exp = Date.parse(a.exp);
  return Number.isFinite(exp) && exp > now ? a.token : null;
}

// True when there is no token, or it expires within RECONNECT_WINDOW_MS.
export async function needsReconnect(now: number = Date.now()): Promise<boolean> {
  const a = await getStored();
  if (!a) return true;
  const exp = Date.parse(a.exp);
  return !Number.isFinite(exp) || exp - now < RECONNECT_WINDOW_MS;
}

export function onChange(cb: (a: StoredAuth | null) => void): () => void {
  const listener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    area: chrome.storage.AreaName,
  ): void => {
    if (area === 'local' && KEY in changes) {
      const nv = changes[KEY]?.newValue;
      cb(isStoredAuth(nv) ? nv : null);
    }
  };
  ext.storage.onChanged.addListener(listener);
  return () => ext.storage.onChanged.removeListener(listener);
}
