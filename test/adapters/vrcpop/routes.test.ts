import { describe, expect, it } from 'vitest';
import { isAllowed, assertAllowed, request, ROUTES } from '../../../src/adapters/vrcpop/routes';
import { ownEventRef, ownGroupRef } from '../../../src/adapters/vrcpop/types';
import { isBridgeError } from '../../../src/core/errors';
import type { VrcpopEventPayload } from '../../../src/core/mapping/to-vrcpop';
import { makeFakeAgent, ok } from './fake-agent';

const GRP = ownGroupRef('grp_00000000-0000-4000-8000-000000000001', 'Example Club');
const EVT = ownEventRef(100001);

function code(fn: () => unknown): string {
  try {
    fn();
  } catch (e) {
    return isBridgeError(e) ? e.code : 'NON_BRIDGE';
  }
  return 'NO_THROW';
}

describe('vrcpop route allowlist', () => {
  it('accepts every own-surface route path', () => {
    expect(isAllowed('GET', '/dashboard')).toBe(true);
    expect(isAllowed('GET', '/manage/club/grp_00000000-0000-4000-8000-000000000001/events')).toBe(true);
    expect(isAllowed('GET', '/manage/club/grp_00000000-0000-4000-8000-000000000001/events/100001/edit')).toBe(true);
    expect(isAllowed('GET', '/api/event-lineup.php?event_id=100001')).toBe(true);
    expect(isAllowed('GET', '/api/dj/?action=genres')).toBe(true);
    expect(isAllowed('GET', '/api/dj/?action=energy')).toBe(true);
    expect(isAllowed('GET', '/api/dj/?action=search&q=abc')).toBe(true);
    expect(isAllowed('GET', '/api/dj/?action=search-all&q=abc&type=dj')).toBe(true);
    expect(isAllowed('POST', '/api/events/?action=create')).toBe(true);
    expect(isAllowed('POST', '/api/events/?action=update')).toBe(true);
    expect(isAllowed('POST', '/api/events/?action=delete')).toBe(true);
    expect(isAllowed('POST', '/api/events/upload-flyer.php')).toBe(true);
    expect(isAllowed('DELETE', '/api/events/upload-flyer.php')).toBe(true);
  });

  it('refuses public + foreign + bulk surfaces', () => {
    expect(isAllowed('GET', '/event/100001')).toBe(false); // public event page
    expect(isAllowed('GET', '/club/some-other-club')).toBe(false);
    expect(isAllowed('POST', '/api/events/?action=list')).toBe(false);
    expect(isAllowed('POST', '/api/events/?action=bulk-publish')).toBe(false);
    expect(isAllowed('POST', '/api/events/?action=duplicate')).toBe(false);
    expect(isAllowed('GET', '/api/events/?action=collab-list&event_id=1')).toBe(false);
    expect(isAllowed('GET', '/api/dj/?action=session')).toBe(false);
    expect(isAllowed('GET', '/manage/club/grp_00000000-0000-4000-8000-000000000001/settings')).toBe(false);
    // right path, wrong method:
    expect(isAllowed('GET', '/api/events/?action=create')).toBe(false);
  });

  it('assertAllowed throws UNSUPPORTED for a non-allowlisted path', () => {
    expect(code(() => assertAllowed('GET', '/event/100001'))).toBe('UNSUPPORTED');
    expect(code(() => assertAllowed('POST', '/api/events/?action=bulk-publish'))).toBe('UNSUPPORTED');
  });

  it('every route id is unique', () => {
    const ids = ROUTES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('request() brand + CSRF enforcement', () => {
  const payload = { action: 'create', group_id: GRP.id } as unknown as VrcpopEventPayload;

  it('refuses a write with no CSRF token', async () => {
    const { agent } = makeFakeAgent(() => ok({ success: true }));
    await expect(request('create', { group: GRP, body: payload }, { agent })).rejects.toMatchObject({ code: 'VALIDATION' });
  });

  it('refuses a raw (unbranded) group id — own-surface rule', async () => {
    const { agent } = makeFakeAgent(() => ok({ success: true }));
    const rawGroup = { id: GRP.id, name: 'x' } as unknown as typeof GRP; // not minted from a manage listing
    await expect(request('create', { group: rawGroup, body: payload }, { agent, csrf: 'T' })).rejects.toMatchObject({ code: 'NOT_AUTHORIZED' });
  });

  it('refuses a raw (unbranded) event id on an edit route', async () => {
    const { agent } = makeFakeAgent(() => ok({ success: true }));
    const rawEvent = { id: 100001 } as unknown as typeof EVT;
    await expect(request('editPage', { group: GRP, event: rawEvent }, { agent })).rejects.toMatchObject({ code: 'NOT_AUTHORIZED' });
  });

  it('builds a create POST with the CSRF header + json body', async () => {
    const { agent, httpCalls } = makeFakeAgent(() => ok({ success: true, event_id: 100009 }));
    await request('create', { group: GRP, body: payload }, { agent, csrf: 'TEST_CSRF_TOKEN' });
    expect(httpCalls).toHaveLength(1);
    const req = httpCalls[0]!;
    expect(req.method).toBe('POST');
    expect(req.path).toBe('/api/events/?action=create');
    expect(req.headers?.['X-CSRF-Token']).toBe('TEST_CSRF_TOKEN');
    expect(req.body).toEqual({ kind: 'json', json: payload });
    expect(req.responseType).toBe('json');
  });

  it('builds a flyer multipart with flyer/group_id/event_id parts', async () => {
    const { agent, httpCalls } = makeFakeAgent(() => ok({ success: true, flyer_url: '/flyers/x.png' }));
    await request('flyerUpload', { group: GRP, event: EVT, blobId: 'blob-1', filename: 'f.png', mime: 'image/png' }, { agent, csrf: 'T' });
    const req = httpCalls[0]!;
    expect(req.method).toBe('POST');
    expect(req.path).toBe('/api/events/upload-flyer.php');
    expect(req.headers?.['X-CSRF-Token']).toBe('T');
    expect(req.body?.kind).toBe('multipart');
    if (req.body?.kind === 'multipart') {
      const byName = Object.fromEntries(req.body.parts.map((p) => [p.name, p]));
      expect(byName.flyer).toMatchObject({ filename: 'f.png', mime: 'image/png', blobId: 'blob-1' });
      expect(byName.group_id).toMatchObject({ value: GRP.id });
      expect(byName.event_id).toMatchObject({ value: '100001' });
    }
  });

  it('url-encodes the performer query and stays on the allowlist', async () => {
    const { agent, httpCalls } = makeFakeAgent(() => ok({ success: true, profiles: [], historical: [] }));
    await request('performerSearchAll', { q: 'a b&c' }, { agent });
    expect(httpCalls[0]!.path).toBe('/api/dj/?action=search-all&q=a%20b%26c&type=dj');
    expect(isAllowed('GET', httpCalls[0]!.path)).toBe(true);
  });
});
