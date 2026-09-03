// Map vrcpop HttpResult -> BridgeError, and parse write responses. Error model
// (plan P4): 401/redirect-to-login -> NOT_LOGGED_IN; 403 -> NOT_AUTHORIZED;
// 404 -> NOT_FOUND; JSON {success:false,error} -> VALIDATION(message); 500
// "Concurrent edit detected" -> VERSION_CONFLICT; bad JSON -> PARSE.
import { BridgeError } from '../../core/errors';
import type { HttpResult } from '../../shared/agent-protocol';

const LOGIN_PATH = /^\/(login|signin|sign-in|sign|auth|oauth|account\/login)/i;

// A followed redirect that landed on a login/OAuth surface (or bare home) means
// the session is gone.
export function looksLikeLogin(finalUrl: string): boolean {
  try {
    const p = new URL(finalUrl).pathname;
    return p === '/' || LOGIN_PATH.test(p) || p.includes('/api/dj/callback');
  } catch {
    return false;
  }
}

function statusError(res: HttpResult, context: string): BridgeError | null {
  switch (res.status) {
    case 401:
      return new BridgeError('NOT_LOGGED_IN', `${context}: not logged in (401)`);
    case 403:
      return new BridgeError('NOT_AUTHORIZED', `${context}: not authorized (403)`);
    case 404:
      return new BridgeError('NOT_FOUND', `${context}: not found (404)`);
    case 429:
      return new BridgeError('RATE_LIMITED', `${context}: rate limited (429)`);
    default:
      return null;
  }
}

// Throw if a read (HTML/JSON GET) failed or bounced to login. 2xx returns void.
export function classifyRead(res: HttpResult, context: string): void {
  const se = statusError(res, context);
  if (se) throw se;
  if (res.status >= 200 && res.status < 300) {
    if (looksLikeLogin(res.finalUrl)) throw new BridgeError('NOT_LOGGED_IN', `${context}: redirected to login`);
    return;
  }
  if (res.status >= 500) throw new BridgeError('UNKNOWN', `${context}: server error (${res.status})`);
  throw new BridgeError('UNKNOWN', `${context}: unexpected status ${res.status}`);
}

function isConcurrentEdit(res: HttpResult): boolean {
  return res.status >= 500 && !!res.body && /concurrent edit/i.test(res.body);
}

export interface WriteResponse {
  success?: boolean;
  error?: string;
  [k: string]: unknown;
}

// Parse a JSON write response, mapping failures to BridgeError. Returns the
// object on success.
export function parseWriteJson(res: HttpResult, context: string): WriteResponse {
  if (isConcurrentEdit(res)) {
    throw new BridgeError('VERSION_CONFLICT', `${context}: concurrent edit detected — re-read the event and retry`);
  }
  const se = statusError(res, context);
  if (se) throw se;
  if (looksLikeLogin(res.finalUrl)) throw new BridgeError('NOT_LOGGED_IN', `${context}: redirected to login`);

  let parsed: unknown;
  try {
    parsed = JSON.parse(res.body ?? '');
  } catch {
    throw new BridgeError('PARSE', `${context}: response was not JSON (status ${res.status})`);
  }
  if (typeof parsed !== 'object' || parsed === null) {
    throw new BridgeError('PARSE', `${context}: JSON response was not an object`);
  }
  const obj = parsed as WriteResponse;
  if (obj.success === false) {
    throw new BridgeError('VALIDATION', `${context}: ${obj.error ?? 'request rejected'}`);
  }
  if (res.status >= 400) {
    throw new BridgeError('UNKNOWN', `${context}: status ${res.status}`);
  }
  return obj;
}

// Parse a JSON read (vocab/lineup/search). Maps status/login failures; returns
// the parsed value (caller narrows).
export function parseReadJson(res: HttpResult, context: string): unknown {
  classifyRead(res, context);
  try {
    return JSON.parse(res.body ?? '');
  } catch {
    throw new BridgeError('PARSE', `${context}: response was not JSON`);
  }
}
