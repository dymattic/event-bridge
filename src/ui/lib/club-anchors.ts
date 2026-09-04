// Cross-platform club identity. PURE (no runtime/adapters/webext) so node tests
// load it. A ClubAnchor groups the same real club across platforms: clubs that
// share a VRChat group id auto-group (rave.page + vrcpop fill it, vrc.tl usually
// doesn't), stored ClubLinks add/override members, and a club with neither is a
// singleton `solo:<platform>:<id>` anchor.
import type { Platform } from '../../shared/agent-protocol';
import { PLATFORM_ORDER } from './platform-meta';

export type ClubSource = 'vrchatGroup' | 'link' | 'solo';

// Subset of adapters/OwnClub this pure module needs (keeps it adapter-free).
export interface AnchorClub {
  id: string;
  name: string;
  vrchatGroupId?: string;
}

// Persisted in storage.local (`clubLinks`), canonical shape lives here so the
// runtime store can re-export it and the pure grouping can consume it.
export interface ClubLink {
  anchorId: string; // may itself be a grp id or a solo:<platform>:<id> string
  members: Partial<Record<Platform, { organizerId: string; name: string }>>;
}

export interface ClubAnchor {
  anchorId: string;
  name: string;
  members: Partial<Record<Platform, { id: string; name: string; source: ClubSource }>>;
}

function refKey(platform: Platform, id: string): string {
  return `${platform}:${id}`;
}

export function soloAnchorId(platform: Platform, id: string): string {
  return `solo:${platform}:${id}`;
}

export function buildClubAnchors(
  clubsByPlatform: Partial<Record<Platform, AnchorClub[]>>,
  links: ClubLink[],
): ClubAnchor[] {
  // (platform,clubId) claimed by a link -> skip auto-placement (the link wins).
  const claimed = new Set<string>();
  for (const l of links) {
    for (const p of PLATFORM_ORDER) {
      const m = l.members[p];
      if (m) claimed.add(refKey(p, m.organizerId));
    }
  }

  const anchors = new Map<string, ClubAnchor>();
  const ensure = (anchorId: string): ClubAnchor => {
    let a = anchors.get(anchorId);
    if (!a) {
      a = { anchorId, name: '', members: {} };
      anchors.set(anchorId, a);
    }
    return a;
  };

  // 1. Auto-place unclaimed clubs (grp id -> vrchatGroup anchor, else solo).
  for (const p of PLATFORM_ORDER) {
    for (const club of clubsByPlatform[p] ?? []) {
      if (claimed.has(refKey(p, club.id))) continue;
      const anchorId = club.vrchatGroupId ?? soloAnchorId(p, club.id);
      ensure(anchorId).members[p] = {
        id: club.id,
        name: club.name,
        source: club.vrchatGroupId ? 'vrchatGroup' : 'solo',
      };
    }
  }

  // 2. Apply links (override members; prefer a fresh resolved name).
  for (const l of links) {
    const a = ensure(l.anchorId);
    for (const p of PLATFORM_ORDER) {
      const m = l.members[p];
      if (!m) continue;
      const fresh = (clubsByPlatform[p] ?? []).find((c) => c.id === m.organizerId);
      a.members[p] = { id: m.organizerId, name: fresh?.name ?? m.name, source: 'link' };
    }
  }

  // 3. Name = first member by PLATFORM_ORDER; drop empty anchors.
  const out: ClubAnchor[] = [];
  for (const a of anchors.values()) {
    const first = PLATFORM_ORDER.map((p) => a.members[p]).find((m) => m);
    if (!first) continue;
    a.name = first.name;
    out.push(a);
  }
  out.sort((x, y) => x.name.localeCompare(y.name) || x.anchorId.localeCompare(y.anchorId));
  return out;
}

// (platform, clubId) -> anchorId. Falls back to the solo id for a club not in
// any built anchor, so grouping stays stable and per-club.
export function anchorLookup(anchors: ClubAnchor[]): (platform: Platform, clubId: string) => string {
  const index = new Map<string, string>();
  for (const a of anchors) {
    for (const p of PLATFORM_ORDER) {
      const m = a.members[p];
      if (m) index.set(refKey(p, m.id), a.anchorId);
    }
  }
  return (platform, clubId) => index.get(refKey(platform, clubId)) ?? soloAnchorId(platform, clubId);
}
