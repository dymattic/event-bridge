// Human copy for every BridgeError code surfaced in the dashboard/popup: one
// sentence saying what happened + the next step the user can take. ONE place so
// the views don't scatter `code: message` strings. PURE (core/errors + pure
// platform-meta only, no runtime/adapters) -> node/happy-dom testable.
import type { BridgeErrorCode } from '../../core/errors';
import { isBridgeError } from '../../core/errors';
import type { Platform } from '../../shared/agent-protocol';
import { PLATFORM_NAME } from './platform-meta';

// Optional affordance a surface can render alongside the copy (e.g. the popup's
// "Grant site access" button). The copy stands on its own without it.
export type ErrorAction = 'grant-permission' | 'reconnect' | 'refresh';

export interface ErrorCopy {
  message: string; // what went wrong, one sentence
  next?: string; // the recommended next step
  action?: ErrorAction;
}

// `<platform>` in a template resolves to the platform's name, else "the platform".
function fill(t: string, platform?: Platform): string {
  return t.replaceAll('<platform>', platform ? PLATFORM_NAME[platform] : 'the platform');
}

const COPY: Record<BridgeErrorCode, ErrorCopy> = {
  NOT_LOGGED_IN: { message: "You're not signed in to <platform>.", next: 'Sign in to <platform> in this browser, then Refresh.', action: 'refresh' },
  NOT_AUTHORIZED: { message: "Your <platform> account can't manage this club or event.", next: 'Switch to an account that manages it, then Refresh.' },
  PERMISSION_MISSING: { message: "event-bridge doesn't have access to <platform> yet.", next: 'Grant site access.', action: 'grant-permission' },
  AGENT_UNAVAILABLE: { message: "Couldn't reach the <platform> tab.", next: 'Open <platform> in a tab and Refresh.' },
  VERSION_CONFLICT: { message: 'This event changed elsewhere since you loaded it.', next: 'Reloaded the event — review the changes and save again.', action: 'refresh' },
  VALIDATION: { message: "Something in the event isn't valid for <platform>.", next: 'Check the highlighted fields and try again.' },
  NOT_FOUND: { message: 'That event or club no longer exists on <platform>.', next: 'Refresh and try again.', action: 'refresh' },
  RATE_LIMITED: { message: '<platform> asked us to slow down.', next: 'Wait a moment, then try again.' },
  NETWORK: { message: "Couldn't reach <platform>.", next: 'Check your connection, then try again.' },
  TIMEOUT: { message: '<platform> took too long to respond.', next: 'Try again in a moment.' },
  PARSE: { message: "Couldn't read <platform>'s response.", next: 'Refresh; if it keeps happening, please report it.' },
  UNSUPPORTED: { message: '<platform> does not support this action.' },
  CANCELLED: { message: 'Cancelled.' },
  UNRESOLVED_REF: { message: "A run step referred to a result that isn't there.", next: 'Run it again from the start.' },
  UNKNOWN: { message: 'Something went wrong.', next: 'Try again; if it keeps happening, report it with the Jobs step details.' },
};

export function errorCopy(code: BridgeErrorCode, platform?: Platform): ErrorCopy {
  const c = COPY[code] ?? COPY.UNKNOWN;
  return {
    message: fill(c.message, platform),
    ...(c.next ? { next: fill(c.next, platform) } : {}),
    ...(c.action ? { action: c.action } : {}),
  };
}

// One display string for any thrown value. BridgeError -> "message next";
// anything else -> its own message (never a raw `code:` dump at the user).
export function errorText(e: unknown, platform?: Platform): string {
  if (isBridgeError(e)) {
    const c = errorCopy(e.code, platform);
    return c.next ? `${c.message} ${c.next}` : c.message;
  }
  return e instanceof Error ? e.message : String(e);
}

// Raw diagnostic string for developer surfaces (#/dev/* panels): the code +
// message, deliberately unfriendly so a contributor sees exactly what the
// adapter threw (the human copy above hides the code and assumes a reload the
// dev panels don't do).
export function errorDebug(e: unknown): string {
  if (isBridgeError(e)) return `${e.code}: ${e.message}`;
  return e instanceof Error ? e.message : String(e);
}
