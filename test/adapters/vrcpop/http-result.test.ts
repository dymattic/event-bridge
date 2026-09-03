import { describe, expect, it } from 'vitest';
import { classifyRead, looksLikeLogin, parseWriteJson, parseReadJson } from '../../../src/adapters/vrcpop/http-result';
import { isBridgeError } from '../../../src/core/errors';
import type { HttpResult } from '../../../src/shared/agent-protocol';

function res(partial: Partial<HttpResult>): HttpResult {
  return { status: 200, finalUrl: 'https://vrcpop.com/dashboard', headers: {}, body: null, ...partial };
}

function codeOf(fn: () => unknown): string {
  try {
    fn();
  } catch (e) {
    return isBridgeError(e) ? e.code : 'NON_BRIDGE';
  }
  return 'NO_THROW';
}

describe('looksLikeLogin', () => {
  it('flags login/oauth/home landings', () => {
    expect(looksLikeLogin('https://vrcpop.com/login')).toBe(true);
    expect(looksLikeLogin('https://vrcpop.com/')).toBe(true);
    expect(looksLikeLogin('https://vrcpop.com/api/dj/callback.php')).toBe(true);
    expect(looksLikeLogin('https://vrcpop.com/dashboard')).toBe(false);
  });
});

describe('classifyRead status mapping', () => {
  it('maps auth/notfound statuses', () => {
    expect(codeOf(() => classifyRead(res({ status: 401 }), 'x'))).toBe('NOT_LOGGED_IN');
    expect(codeOf(() => classifyRead(res({ status: 403 }), 'x'))).toBe('NOT_AUTHORIZED');
    expect(codeOf(() => classifyRead(res({ status: 404 }), 'x'))).toBe('NOT_FOUND');
    expect(codeOf(() => classifyRead(res({ status: 429 }), 'x'))).toBe('RATE_LIMITED');
  });
  it('maps a followed redirect to login as NOT_LOGGED_IN', () => {
    expect(codeOf(() => classifyRead(res({ status: 200, finalUrl: 'https://vrcpop.com/login' }), 'x'))).toBe('NOT_LOGGED_IN');
  });
  it('passes a clean 200', () => {
    expect(codeOf(() => classifyRead(res({ status: 200, body: '<html></html>' }), 'x'))).toBe('NO_THROW');
  });
});

describe('parseWriteJson mapping', () => {
  it('maps 500 "Concurrent edit detected" to VERSION_CONFLICT', () => {
    expect(codeOf(() => parseWriteJson(res({ status: 500, body: 'Concurrent edit detected' }), 'update'))).toBe('VERSION_CONFLICT');
  });
  it('maps {success:false,error} to VALIDATION and keeps the message', () => {
    let msg = '';
    try {
      parseWriteJson(res({ status: 200, body: JSON.stringify({ success: false, error: 'Bad genre id' }) }), 'create');
    } catch (e) {
      if (isBridgeError(e)) msg = e.message;
    }
    expect(msg).toContain('Bad genre id');
  });
  it('returns the parsed object on success', () => {
    const out = parseWriteJson(res({ status: 201, body: JSON.stringify({ success: true, event_id: 100009 }) }), 'create');
    expect(out.event_id).toBe(100009);
  });
  it('maps non-JSON to PARSE', () => {
    expect(codeOf(() => parseWriteJson(res({ status: 200, body: '<html>oops</html>' }), 'create'))).toBe('PARSE');
  });
  it('maps 401 to NOT_LOGGED_IN before parsing', () => {
    expect(codeOf(() => parseWriteJson(res({ status: 401, body: 'nope' }), 'create'))).toBe('NOT_LOGGED_IN');
  });
});

describe('parseReadJson', () => {
  it('parses a JSON read body', () => {
    const out = parseReadJson(res({ status: 200, body: JSON.stringify({ genres: [] }) }), 'genres') as { genres: unknown[] };
    expect(out.genres).toEqual([]);
  });
});
