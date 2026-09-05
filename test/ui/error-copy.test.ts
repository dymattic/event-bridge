import { describe, expect, it } from 'vitest';
import { BridgeError, type BridgeErrorCode } from '../../src/core/errors';
import { errorCopy, errorDebug, errorText } from '../../src/ui/lib/error-copy';

const CODES: BridgeErrorCode[] = [
  'NOT_LOGGED_IN', 'NOT_AUTHORIZED', 'PERMISSION_MISSING', 'AGENT_UNAVAILABLE',
  'VERSION_CONFLICT', 'VALIDATION', 'NOT_FOUND', 'RATE_LIMITED', 'NETWORK',
  'TIMEOUT', 'PARSE', 'UNSUPPORTED', 'CANCELLED', 'UNRESOLVED_REF', 'UNKNOWN',
];

describe('errorCopy', () => {
  it('has a non-empty human sentence for every code, no unresolved template', () => {
    for (const code of CODES) {
      const c = errorCopy(code);
      expect(c.message.length, code).toBeGreaterThan(0);
      expect(c.message, code).not.toContain('<platform>');
      if (c.next) expect(c.next, code).not.toContain('<platform>');
    }
  });

  it('substitutes the platform name when given, else "the platform"', () => {
    expect(errorCopy('NOT_LOGGED_IN', 'vrctl').message).toContain('vrc.tl');
    expect(errorCopy('NOT_LOGGED_IN', 'vrcpop').message).toContain('vrcpop.com');
    expect(errorCopy('NOT_LOGGED_IN', 'ravepage').message).toContain('rave.page');
    expect(errorCopy('NOT_LOGGED_IN').message).toContain('the platform');
  });

  it('every code that needs a next step has one (login/permission/conflict/network/etc.)', () => {
    for (const code of ['NOT_LOGGED_IN', 'PERMISSION_MISSING', 'VERSION_CONFLICT', 'NETWORK', 'TIMEOUT', 'RATE_LIMITED'] as BridgeErrorCode[]) {
      expect(errorCopy(code).next, code).toBeTruthy();
    }
  });

  it('surfaces affordance hints for grant/refresh codes', () => {
    expect(errorCopy('PERMISSION_MISSING').action).toBe('grant-permission');
    expect(errorCopy('NOT_LOGGED_IN').action).toBe('refresh');
    expect(errorCopy('VERSION_CONFLICT').action).toBe('refresh');
  });
});

describe('errorText', () => {
  it('joins message + next for a BridgeError, resolving the platform', () => {
    const t = errorText(new BridgeError('NOT_LOGGED_IN'), 'vrctl');
    expect(t).toContain('vrc.tl');
    expect(t).toContain('Refresh');
  });

  it('passes through a plain Error message and a raw string', () => {
    expect(errorText(new Error('boom'))).toBe('boom');
    expect(errorText('nope')).toBe('nope');
  });

  it('never leaks a raw "CODE:" dump for a known BridgeError', () => {
    const t = errorText(new BridgeError('VERSION_CONFLICT'));
    expect(t).not.toContain('VERSION_CONFLICT');
  });
});

describe('errorDebug (developer panels)', () => {
  it('keeps the raw "CODE: message" for a BridgeError', () => {
    expect(errorDebug(new BridgeError('VERSION_CONFLICT', 'boom'))).toBe('VERSION_CONFLICT: boom');
  });
  it('passes through non-BridgeError values', () => {
    expect(errorDebug(new Error('x'))).toBe('x');
    expect(errorDebug('y')).toBe('y');
  });
});
