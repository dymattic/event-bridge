import { describe, expect, it } from 'vitest';
import { anchorLookup, buildClubAnchors, soloAnchorId, type AnchorClub, type ClubLink } from '../../src/ui/lib/club-anchors';

const GRP = 'grp_00000000-0000-4000-8000-000000000001';
const GRP_R = 'grp_00000000-0000-4000-8000-000000009001';

const vrcpopClub: AnchorClub = { id: GRP, name: 'Example Club', vrchatGroupId: GRP };
const vrctlClub: AnchorClub = { id: '9001', name: 'Example Club' }; // no grp id
const ravepageClub: AnchorClub = { id: GRP_R, name: 'Neon Collective', vrchatGroupId: GRP_R };

describe('buildClubAnchors', () => {
  it('a club with a VRChat group id anchors on it; without one is a solo anchor', () => {
    const anchors = buildClubAnchors({ vrctl: [vrctlClub], vrcpop: [vrcpopClub] }, []);
    expect(anchors).toHaveLength(2);
    const byId = new Map(anchors.map((a) => [a.anchorId, a]));
    expect(byId.get(GRP)?.members.vrcpop?.source).toBe('vrchatGroup');
    expect(byId.get(soloAnchorId('vrctl', '9001'))?.members.vrctl?.source).toBe('solo');
  });

  it('clubs sharing a VRChat group id auto-group under that grp id', () => {
    const anchors = buildClubAnchors({ vrcpop: [vrcpopClub], ravepage: [{ ...ravepageClub, id: GRP, vrchatGroupId: GRP }] }, []);
    expect(anchors).toHaveLength(1);
    expect(anchors[0]?.anchorId).toBe(GRP);
    expect(anchors[0]?.members.vrcpop?.source).toBe('vrchatGroup');
    expect(anchors[0]?.members.ravepage?.source).toBe('vrchatGroup');
  });

  it('a stored link merges a grp-less club into a grp anchor (one row, both members)', () => {
    const link: ClubLink = { anchorId: GRP, members: { vrctl: { organizerId: '9001', name: 'Example Club' } } };
    const anchors = buildClubAnchors({ vrctl: [vrctlClub], vrcpop: [vrcpopClub] }, [link]);
    expect(anchors).toHaveLength(1);
    const a = anchors[0]!;
    expect(a.anchorId).toBe(GRP);
    expect(a.members.vrcpop?.source).toBe('vrchatGroup');
    expect(a.members.vrctl?.source).toBe('link');
    expect(a.name).toBe('Example Club'); // first by PLATFORM_ORDER = vrctl
  });

  it('a link anchorId may be a solo id of another platform (opaque strings)', () => {
    const solo = soloAnchorId('vrctl', '9001');
    const link: ClubLink = {
      anchorId: solo,
      members: { vrctl: { organizerId: '9001', name: 'Example Club' }, vrcpop: { organizerId: GRP, name: 'Example Club' } },
    };
    const anchors = buildClubAnchors({ vrctl: [vrctlClub], vrcpop: [vrcpopClub] }, [link]);
    expect(anchors).toHaveLength(1);
    expect(anchors[0]?.anchorId).toBe(solo);
    expect(Object.keys(anchors[0]!.members).sort()).toEqual(['vrcpop', 'vrctl']);
  });

  it('prefers a fresh resolved club name over the stored link name', () => {
    const link: ClubLink = { anchorId: GRP, members: { vrctl: { organizerId: '9001', name: 'Stale Name' } } };
    const anchors = buildClubAnchors({ vrctl: [{ id: '9001', name: 'Fresh Name' }], vrcpop: [vrcpopClub] }, [link]);
    expect(anchors[0]?.members.vrctl?.name).toBe('Fresh Name');
  });
});

describe('anchorLookup', () => {
  it('maps (platform, clubId) to the anchor id, solo fallback for unknown clubs', () => {
    const link: ClubLink = { anchorId: GRP, members: { vrctl: { organizerId: '9001', name: 'Example Club' } } };
    const anchors = buildClubAnchors({ vrctl: [vrctlClub], vrcpop: [vrcpopClub] }, [link]);
    const lookup = anchorLookup(anchors);
    expect(lookup('vrctl', '9001')).toBe(GRP);
    expect(lookup('vrcpop', GRP)).toBe(GRP);
    expect(lookup('ravepage', 'grp_unknown')).toBe(soloAnchorId('ravepage', 'grp_unknown'));
  });
});
