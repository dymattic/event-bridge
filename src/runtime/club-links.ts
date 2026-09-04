// Cross-platform club link store (storage.local key `clubLinks`). A ClubLink adds
// members to a club anchor so the same real club groups across platforms even
// when a VRChat group id is absent (vrc.tl). The canonical ClubLink shape lives
// in the pure ui/lib/club-anchors module (node-testable grouping); this owns
// persistence. Tested with a fake `ext.storage` like runtime/settings + link-store.
import { ext } from '../shared/webext';
import type { Platform } from '../shared/agent-protocol';
import type { ClubLink } from '../ui/lib/club-anchors';

export type { ClubLink };

const KEY = 'clubLinks';

async function readAll(): Promise<ClubLink[]> {
  const got = await ext.storage.local.get(KEY);
  const v = got[KEY];
  return Array.isArray(v) ? (v as ClubLink[]) : [];
}

async function writeAll(links: ClubLink[]): Promise<void> {
  await ext.storage.local.set({ [KEY]: links });
}

export async function listClubLinks(): Promise<ClubLink[]> {
  return readAll();
}

// Persist a link, replacing any existing one with the same anchorId.
export async function saveClubLink(link: ClubLink): Promise<ClubLink> {
  const next = (await readAll()).filter((l) => l.anchorId !== link.anchorId);
  next.push(link);
  await writeAll(next);
  return link;
}

// Drop one platform's member from an anchor's link; remove the link if empty.
export async function removeClubMember(anchorId: string, platform: Platform): Promise<void> {
  const all = await readAll();
  const next: ClubLink[] = [];
  for (const l of all) {
    if (l.anchorId !== anchorId) {
      next.push(l);
      continue;
    }
    const members = { ...l.members };
    delete members[platform];
    if (Object.keys(members).length > 0) next.push({ ...l, members });
  }
  await writeAll(next);
}
