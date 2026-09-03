// Configures the generated OpenAPI client for the rave.page DEV API and maps
// generated ApiError -> BridgeError. This is the ONLY place API_BASE appears.
import { OpenAPI } from './api-client/core/OpenAPI';
import { ApiError } from './api-client/core/ApiError';
import type { ApiRequestOptions } from './api-client/core/ApiRequestOptions';
import { BridgeError, isBridgeError, type BridgeErrorCode } from '../../core/errors';
import { clear, getValidToken } from './token-store';

// Dev-only base. Swap here (single constant) if a prod base is ever approved.
export const API_BASE = 'https://development.api.rave.page';

// The generated spec has no servers[]; wire BASE + a Bearer resolver here.
OpenAPI.BASE = API_BASE;
OpenAPI.WITH_CREDENTIALS = false; // Bearer only; never send cross-origin cookies
OpenAPI.TOKEN = async (options: ApiRequestOptions): Promise<string> => {
  // /auth/exchange is anonymous-public (called before any token exists).
  if (options.url === '/auth/exchange') return '';
  const t = await getValidToken();
  if (!t) throw new BridgeError('NOT_LOGGED_IN', 'not connected to rave.page');
  return t;
};

function apiErrorMessage(err: ApiError): { message: string; details: unknown } {
  const body = err.body as { message?: unknown; details?: unknown } | string | null | undefined;
  if (body && typeof body === 'object') {
    return {
      message: typeof body.message === 'string' ? body.message : err.message,
      details: body.details,
    };
  }
  return { message: err.message, details: body ?? undefined };
}

// Map a thrown value from a generated service call to a BridgeError.
export function toBridgeError(err: unknown): BridgeError {
  if (isBridgeError(err)) return err; // e.g. NOT_LOGGED_IN from the TOKEN resolver
  if (err instanceof Error && err.name === 'CancelError') {
    return new BridgeError('CANCELLED', 'request cancelled');
  }
  if (err instanceof ApiError || (err instanceof Error && err.name === 'ApiError')) {
    const e = err as ApiError;
    const { message, details } = apiErrorMessage(e);
    const status = e.status;
    if (status === 401) {
      void clear().catch(() => undefined); // mark stored token invalid; UI offers Reconnect
      return new BridgeError('NOT_LOGGED_IN', message, details);
    }
    let code: BridgeErrorCode;
    if (status === 403) code = 'NOT_AUTHORIZED';
    else if (status === 404) code = 'NOT_FOUND';
    else if (status === 409 || status === 422 || status === 400) code = 'VALIDATION';
    else if (status === 429) code = 'RATE_LIMITED';
    else code = 'NETWORK'; // 5xx + anything else
    return new BridgeError(code, message, details);
  }
  // fetch network failure (TypeError) or unknown
  if (err instanceof TypeError) return new BridgeError('NETWORK', err.message);
  return new BridgeError('UNKNOWN', err instanceof Error ? err.message : String(err));
}
