import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFake } from '../../runtime/fake-ext';

// Mock webext (module load / ensureConfigured settings read) + ROUTES.
const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

const data = vi.hoisted(() => ({
  groups: [] as Record<string, unknown>[],
  organizers: [] as Record<string, unknown>[],
}));
vi.mock('../../../src/adapters/ravepage/routes', () => ({
  ROUTES: {
    getMyGroups: () => Promise.resolve(data.groups),
    listOrganizers: () => Promise.resolve(data.organizers),
  },
}));

import { listOwnClubs } from '../../../src/adapters/ravepage/adapter';

beforeEach(() => {
  h.ext = createFake().ext;
});

describe('ravepage listOwnClubs dedup', () => {
  it('lists a group once when /groups/mine (grp_<uuid>) and /events/organizers (bare uuid) disagree on format', async () => {
    data.groups = [{ id: 'grp_2dc1e6c6-0000-4000-8000-000000000001', name: 'The Cauldron', can_organize_events: true }];
    data.organizers = [{ id: '2DC1E6C6-0000-4000-8000-000000000001', name: 'The Cauldron', type: 'group' }];
    const clubs = await listOwnClubs();
    expect(clubs).toHaveLength(1);
    expect(clubs[0]?.id).toBe('grp_2dc1e6c6-0000-4000-8000-000000000001'); // prefixed, canonical
    expect(clubs[0]?.name).toBe('The Cauldron');
  });

  it('still adds a genuinely distinct organizer from /events/organizers', async () => {
    data.groups = [{ id: 'grp_aaaa1111-0000-4000-8000-000000000001', name: 'Group A', can_organize_events: true }];
    data.organizers = [{ id: 'usr_bbbb2222-0000-4000-8000-000000000002', name: 'Solo DJ', type: 'user' }];
    const clubs = await listOwnClubs();
    expect(clubs).toHaveLength(2);
    expect(clubs.map((c) => c.name)).toEqual(['Group A', 'Solo DJ']);
  });
});
