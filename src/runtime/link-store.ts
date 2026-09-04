// Minimal cross-platform event link store (storage.local under `links`). One
// EventLink groups the platform refs that represent the same logical event: a
// multi-target create saves one link with every created ref; a single-target
// create saves a one-ref link. P6b/P7 (sync, transfer) build on this.
//
// Page/background side (webext storage); tested with a fake `ext.storage` like
// runtime/settings.
import { ext } from '../shared/webext';
import type { Platform } from '../shared/agent-protocol';
// Type-only (erased): sync setting/baseline types owned by the pure sync planner.
import type { LinkSync, SyncBaseline } from '../ui/lib/sync-plan';

export interface EventRef {
  platform: Platform;
  id: string;
}

export interface EventLink {
  anchorId: string; // stable identity for the logical event across platforms
  refs: EventRef[];
  createdAt: string; // ISO 8601
  // P7 sync (optional, no migration): per-link settings + per-platform baseline.
  sync?: LinkSync;
  lastSynced?: Partial<Record<Platform, SyncBaseline>>;
}

const KEY = 'links';

async function readAll(): Promise<EventLink[]> {
  const got = await ext.storage.local.get(KEY);
  const v = got[KEY];
  return Array.isArray(v) ? (v as EventLink[]) : [];
}

async function writeAll(links: EventLink[]): Promise<void> {
  await ext.storage.local.set({ [KEY]: links });
}

function newAnchorId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `anchor-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Build (not persist) an EventLink for freshly created refs.
export function makeLink(refs: EventRef[]): EventLink {
  return { anchorId: newAnchorId(), refs, createdAt: new Date().toISOString() };
}

export async function listLinks(): Promise<EventLink[]> {
  return readAll();
}

// Persist a link, replacing any existing one with the same anchorId.
export async function saveLink(link: EventLink): Promise<EventLink> {
  const next = (await readAll()).filter((l) => l.anchorId !== link.anchorId);
  next.push(link);
  await writeAll(next);
  return link;
}

export async function findLinkByRef(platform: Platform, id: string): Promise<EventLink | undefined> {
  return (await readAll()).find((l) => l.refs.some((r) => r.platform === platform && r.id === id));
}

// Upsert a link for freshly created/edited refs: merge into an existing link that
// already contains ANY of the refs (replacing that link's same-platform refs),
// else create a new one. Keeps one logical event's refs in a single link across
// repeated runs/retries and transfers (P6.2 follow-up).
export async function upsertLinkForRefs(refs: EventRef[], defaultSync?: LinkSync): Promise<EventLink> {
  if (refs.length === 0) return makeLink(refs);
  const all = await readAll();
  const existing = all.find((l) => l.refs.some((r) => refs.some((n) => n.platform === r.platform && n.id === r.id)));
  const base = existing ?? makeLink([]);
  // New link inherits the settings sync defaults; an existing link keeps its own.
  if (!existing && defaultSync && base.sync === undefined) base.sync = defaultSync;
  const byPlatform = new Map<Platform, EventRef>();
  for (const r of base.refs) byPlatform.set(r.platform, r);
  for (const r of refs) byPlatform.set(r.platform, r); // new refs replace same-platform
  const merged: EventLink = { ...base, refs: [...byPlatform.values()] };
  return saveLink(merged);
}

export async function removeLink(anchorId: string): Promise<void> {
  await writeAll((await readAll()).filter((l) => l.anchorId !== anchorId));
}
