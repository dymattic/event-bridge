import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import type { HttpResult } from '../../../src/shared/agent-protocol';
import { asCategoryId, asDeleteAction, asEventId, asOrganizerId } from '../../../src/adapters/vrctl/ids';
import { buildRequest, request, VRCTL_ROUTES, type VrctlRouteId } from '../../../src/adapters/vrctl/routes';
import { encodeUrlencoded } from '../../../src/adapters/vrctl/forms';

describe('buildRequest (allowlist)', () => {
  it('read routes', () => {
    expect(buildRequest('grid', {})).toMatchObject({ method: 'GET', path: '/admin/event' });
    expect(buildRequest('chooseOrganizer', {})).toMatchObject({ path: '/admin/event/choose-organizer' });
    expect(buildRequest('chooseCategory', { organizerId: asOrganizerId('9001') }).path).toBe(
      '/admin/event/choose-category?organizerId=9001',
    );
    expect(buildRequest('detail', { eventId: asEventId('100002') }).path).toBe('/admin/event/detail/100002');
    expect(buildRequest('performerSearch', { term: 'Example DJ' }).path).toBe(
      '/admin/ajax/performer?term=Example%20DJ&_type=query&q=Example%20DJ',
    );
  });

  it('create write route (promoted toggles the &promoted=0 suffix)', () => {
    const body = encodeUrlencoded([['name', 'x']]);
    const notPromoted = buildRequest('create', { organizerId: asOrganizerId('9001'), categoryId: asCategoryId('1'), promoted: false, body });
    expect(notPromoted).toMatchObject({ method: 'POST', path: '/admin/event/create?categoryId=1&organizerId=9001&promoted=0' });
    const promoted = buildRequest('create', { organizerId: asOrganizerId('9001'), categoryId: asCategoryId('1'), promoted: true, body });
    expect(promoted.path).toBe('/admin/event/create?categoryId=1&organizerId=9001');
  });

  it('delete write route echoes the validated action path', () => {
    const action = asDeleteAction('/admin/event?grid-grid-__id=100002&grid-grid-__key=delete&do=grid-grid-actionCallback');
    expect(buildRequest('delete', { action }).path).toContain('grid-grid-__key=delete');
  });

  it('request() is the sole entry: builds + hands to send', async () => {
    const send = vi.fn(async (): Promise<HttpResult> => ({ status: 200, finalUrl: 'https://vrc.tl/admin/event', headers: {}, body: '' }));
    await request(send, 'grid', {});
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ path: '/admin/event' }));
  });
});

describe('own-events-only refusals', () => {
  it('rejects non-numeric write ids (no injection via raw input)', () => {
    expect(() => asEventId('1 OR 1=1')).toThrow();
    expect(() => asEventId('../../admin')).toThrow();
    expect(() => asOrganizerId('grp_x')).toThrow();
  });

  it('refuses grid actions other than delete', () => {
    expect(() => asDeleteAction('/admin/event?grid-grid-__id=100002&grid-grid-__key=timetable&do=grid-grid-actionCallback')).toThrow();
    expect(() => asDeleteAction('/admin/event?grid-grid-__id=100002&grid-grid-__key=vrChatEventCreate&do=grid-grid-actionCallback')).toThrow();
  });

  it('refuses public / off-path targets as a delete action', () => {
    expect(() => asDeleteAction('/event/100002')).toThrow();
    expect(() => asDeleteAction('/api/v1/events')).toThrow();
    expect(() => asDeleteAction('https://evil.example/admin/event?grid-grid-__key=delete&do=grid-grid-actionCallback&grid-grid-__id=1')).toThrow();
  });

  it('has no route for public listings or arbitrary admin paths', () => {
    const ids = Object.keys(VRCTL_ROUTES);
    expect(ids).not.toContain('publicEvents');
    for (const r of Object.values(VRCTL_ROUTES)) {
      expect(r.pathPattern.startsWith('/admin/')).toBe(true);
    }
    expect(() => buildRequest('bogus' as VrctlRouteId, {} as never)).toThrow();
  });
});

describe('no raw fetch in the adapter', () => {
  it('src/adapters/vrctl/** contains no fetch( call', () => {
    const dir = join(process.cwd(), 'src', 'adapters', 'vrctl');
    const walk = (d: string): string[] =>
      readdirSync(d).flatMap((n) => {
        const p = join(d, n);
        return statSync(p).isDirectory() ? walk(p) : [p];
      });
    for (const f of walk(dir)) {
      if (!f.endsWith('.ts')) continue;
      expect(/fetch\s*\(/.test(readFileSync(f, 'utf8')), `fetch( found in ${f}`).toBe(false);
    }
  });
});
