import { beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { listClubLinks, removeClubMember, saveClubLink } from '../../src/runtime/club-links';
import { createFake } from './fake-ext';

const GRP = 'grp_00000000-0000-4000-8000-000000000001';

beforeEach(() => {
  h.ext = createFake().ext;
});

describe('club-links store', () => {
  it('saves and lists a link', async () => {
    await saveClubLink({ anchorId: GRP, members: { vrctl: { organizerId: '9001', name: 'Example Club' } } });
    const all = await listClubLinks();
    expect(all).toHaveLength(1);
    expect(all[0]?.members.vrctl?.organizerId).toBe('9001');
  });

  it('replaces a link with the same anchorId', async () => {
    await saveClubLink({ anchorId: GRP, members: { vrctl: { organizerId: '9001', name: 'A' } } });
    await saveClubLink({ anchorId: GRP, members: { vrctl: { organizerId: '9001', name: 'A' }, vrcpop: { organizerId: GRP, name: 'A' } } });
    const all = await listClubLinks();
    expect(all).toHaveLength(1);
    expect(Object.keys(all[0]!.members).sort()).toEqual(['vrcpop', 'vrctl']);
  });

  it('removeClubMember drops one platform, and the link when it becomes empty', async () => {
    await saveClubLink({ anchorId: GRP, members: { vrctl: { organizerId: '9001', name: 'A' }, vrcpop: { organizerId: GRP, name: 'A' } } });
    await removeClubMember(GRP, 'vrctl');
    expect((await listClubLinks())[0]?.members.vrctl).toBeUndefined();
    await removeClubMember(GRP, 'vrcpop');
    expect(await listClubLinks()).toHaveLength(0);
  });
});
