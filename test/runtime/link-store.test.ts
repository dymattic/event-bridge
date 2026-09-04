import { beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { findLinkByRef, listLinks, makeLink, removeLink, saveLink } from '../../src/runtime/link-store';
import { createFake } from './fake-ext';

beforeEach(() => {
  h.ext = createFake().ext;
});

describe('link-store', () => {
  it('saves a multi-ref link (multi-target create) and lists it', async () => {
    await saveLink(makeLink([{ platform: 'vrctl', id: '100' }, { platform: 'vrcpop', id: '200' }]));
    const all = await listLinks();
    expect(all).toHaveLength(1);
    expect(all[0]?.refs).toHaveLength(2);
    expect(typeof all[0]?.anchorId).toBe('string');
    expect(typeof all[0]?.createdAt).toBe('string');
  });

  it('saves a single-ref link (single-target create)', async () => {
    await saveLink(makeLink([{ platform: 'ravepage', id: 'evt_1' }]));
    expect((await findLinkByRef('ravepage', 'evt_1'))?.refs).toHaveLength(1);
  });

  it('finds a link by any of its refs, undefined for an unknown ref', async () => {
    await saveLink(makeLink([{ platform: 'vrctl', id: '100' }, { platform: 'vrcpop', id: '200' }]));
    expect((await findLinkByRef('vrcpop', '200'))?.refs.some((r) => r.platform === 'vrctl' && r.id === '100')).toBe(true);
    expect(await findLinkByRef('vrctl', '999')).toBeUndefined();
  });

  it('replaces a link with the same anchorId and removes by anchorId', async () => {
    const link = makeLink([{ platform: 'vrctl', id: '1' }]);
    await saveLink(link);
    await saveLink({ ...link, refs: [{ platform: 'vrctl', id: '1' }, { platform: 'vrcpop', id: '2' }] });
    expect(await listLinks()).toHaveLength(1);
    expect((await listLinks())[0]?.refs).toHaveLength(2);
    await removeLink(link.anchorId);
    expect(await listLinks()).toHaveLength(0);
  });
});
