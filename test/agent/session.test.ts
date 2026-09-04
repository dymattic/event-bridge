// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  detectRavepage,
  detectSession,
  hasVrctlGrid,
  jwtExp,
  parseVrcpopLabel,
  parseVrctlLabel,
  parseVrcpopUser,
} from '../../src/agent/session.dom';

function setUrl(u: string): void {
  (window as unknown as { happyDOM: { setURL: (url: string) => void } }).happyDOM.setURL(u);
}

const fixture = (p: string): string => readFileSync(join(process.cwd(), 'test', 'fixtures', p), 'utf8');

function b64u(s: string): string {
  return Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unsignedJwt(payload: object): string {
  return `${b64u(JSON.stringify({ alg: 'none' }))}.${b64u(JSON.stringify(payload))}.sig`;
}

describe('parseVrcpopUser', () => {
  it('logged in', () => {
    expect(parseVrcpopUser('window.vrcpop.user = { loggedIn: true, userId: 9001, preferences: {} };')).toEqual({
      loggedIn: true,
      userId: 9001,
    });
  });
  it('logged out', () => {
    expect(parseVrcpopUser('window.vrcpop.user = { loggedIn: false };')).toEqual({ loggedIn: false, userId: undefined });
  });
  it('missing', () => {
    expect(parseVrcpopUser('<p>no user script here</p>')).toBeNull();
  });
  it('tolerant to whitespace / newlines', () => {
    expect(parseVrcpopUser('window.vrcpop.user   =\n{\n  loggedIn :  true ,\n  userId : 42 }')).toEqual({
      loggedIn: true,
      userId: 42,
    });
  });
});

describe('parseVrcpopLabel', () => {
  it('reads the Discord display name from the account sidebar', () => {
    expect(parseVrcpopLabel(fixture('vrcpop/dashboard.html'))).toBe('Example User');
  });
  it('never returns a raw id (undefined when absent)', () => {
    expect(parseVrcpopLabel('<div>no sidebar here</div>')).toBeUndefined();
    expect(parseVrcpopLabel('<span class="sidebar-user-name">  </span>')).toBeUndefined();
  });
});

describe('parseVrctlLabel', () => {
  it('reads the account name from the admin navbar dropdown', () => {
    expect(parseVrctlLabel(fixture('vrctl/admin-header.html'))).toBe('Example User');
    expect(parseVrctlLabel(fixture('vrctl/admin-grid.html'))).toBe('Example User');
  });
  it('undefined when the account menu is absent', () => {
    expect(parseVrctlLabel('<nav><a href="/logout">Logout</a></nav>')).toBeUndefined();
  });
});

describe('hasVrctlGrid', () => {
  it('detects the admin events grid marker', () => {
    expect(hasVrctlGrid('<div id="snippet-grid-grid-grid"><table id="datagrid-grid-grid"></table></div>')).toBe(true);
  });
  it('false on a sign-in page', () => {
    expect(hasVrctlGrid('<h1>Sign in</h1><form action="/sign/in"></form>')).toBe(false);
  });
});

describe('jwtExp', () => {
  it('reads a numeric exp', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    expect(jwtExp(unsignedJwt({ exp }))).toBe(exp);
  });
  it('null when exp is absent', () => {
    expect(jwtExp(unsignedJwt({ sub: 'x' }))).toBeNull();
  });
  it('null on a malformed token', () => {
    expect(jwtExp('not-a-jwt')).toBeNull();
  });
});

describe('detectRavepage', () => {
  beforeEach(() => localStorage.clear());
  it('no token -> logged out', () => {
    expect(detectRavepage().loggedIn).toBe(false);
  });
  it('future exp -> logged in with expiresAt', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    localStorage.setItem('auth_token', unsignedJwt({ exp }));
    const s = detectRavepage();
    expect(s.loggedIn).toBe(true);
    expect(new Date(s.expiresAt ?? '').getTime()).toBe(exp * 1000);
  });
  it('expired exp -> logged out', () => {
    localStorage.setItem('auth_token', unsignedJwt({ exp: Math.floor(Date.now() / 1000) - 10 }));
    expect(detectRavepage().loggedIn).toBe(false);
  });
});

describe('detectSession (configurable rave.page origin, no hardcode)', () => {
  it('rejects a rave.page session op whose expected origin != the page', async () => {
    setUrl('https://development.rave.page/');
    await expect(detectSession({ platform: 'ravepage', origin: 'https://other.example' })).rejects.toMatchObject({
      code: 'UNSUPPORTED',
    });
  });

  it('runs the rave.page detector on a custom instance origin when it matches', async () => {
    setUrl('https://custom.rave.example/');
    localStorage.clear();
    const info = await detectSession({ platform: 'ravepage', origin: 'https://custom.rave.example' });
    expect(info.loggedIn).toBe(false); // no token stored -> logged out (no throw)
  });

  it('UNSUPPORTED on an origin with no detector', async () => {
    setUrl('https://unknown.example/');
    await expect(detectSession({})).rejects.toMatchObject({ code: 'UNSUPPORTED' });
  });
});
