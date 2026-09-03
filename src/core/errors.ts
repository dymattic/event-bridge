// Bridge error taxonomy. Shared across core + adapters (P2+ transport).

export type BridgeErrorCode =
  | 'NOT_LOGGED_IN'
  | 'NOT_AUTHORIZED'
  | 'PERMISSION_MISSING'
  | 'AGENT_UNAVAILABLE'
  | 'VERSION_CONFLICT' // vrcpop 500 "Concurrent edit detected"
  | 'VALIDATION' // Nette error nodes / API 4xx / bad core input
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'NETWORK'
  | 'TIMEOUT'
  | 'PARSE'
  | 'UNSUPPORTED'
  | 'CANCELLED'
  | 'UNRESOLVED_REF' // planner ref with no matching prior result
  | 'UNKNOWN';

export class BridgeError extends Error {
  readonly code: BridgeErrorCode;
  readonly details?: unknown;
  constructor(code: BridgeErrorCode, message?: string, details?: unknown) {
    super(message ?? code);
    this.name = 'BridgeError';
    this.code = code;
    this.details = details;
  }
}

export function isBridgeError(e: unknown): e is BridgeError {
  return e instanceof BridgeError;
}
