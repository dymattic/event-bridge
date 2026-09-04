// Pure cross-platform sync planner. Given a link's sync settings, the current
// EventCore per present ref, and each ref's current scoped hash, decides what (if
// anything) to propagate and whether a human must intervene. PURE: imports only
// core (pure) + platform-meta, so node tests load it. The webext-bound engine
// (dashboard/lib/sync.ts) reads cores, computes hashes, and applies the result.
//
// Scoping: only the fields the link opts into (details/lineup/poster/publishState)
// enter the projection, so a change OUTSIDE the scope is invisible to sync.
// Canonical hashes make "changed since baseline" and "differs from source"
// deterministic. Conflicts (a target that drifted from its own baseline) are
// NEVER auto-applied — the UI forces a per-field pick.
import type { EventCore, Flags, Links, Music, Performer, PlatformId, PosterRef, Slot } from '../../core/schema';
import { diffObjects, type ChangedPath } from '../../core/diff';
import { hashCanonical } from '../../core/hash';
import { PLATFORM_ORDER } from './platform-meta';

export type SyncMode = 'off' | 'notify' | 'apply';
export type SyncSource = 'last-edited' | PlatformId;

export interface SyncFields {
  details: boolean;
  lineup: boolean;
  poster: boolean;
  publishState: boolean;
}

// Shared shape for Settings.sync (defaults) and a per-link override.
export interface SyncSettings {
  mode: SyncMode;
  source: SyncSource;
  fields: SyncFields;
}

export interface LinkSync extends SyncSettings {
  publishConfirmed?: boolean; // a public-publish flip was confirmed once for this link
}

export interface SyncBaseline {
  hash: string;
  at: string; // ISO 8601
}

export interface SyncRef {
  platform: PlatformId;
  id: string;
}

// Structural subset of runtime EventLink (kept local so this module stays pure).
export interface SyncLink {
  anchorId?: string;
  refs: SyncRef[];
  sync?: LinkSync;
  lastSynced?: Partial<Record<PlatformId, SyncBaseline>>;
}

export type SyncState = 'off' | 'in-sync' | 'pending' | 'conflict' | 'pick-source';

export interface ScopedField {
  name: string; // dot path (from diffObjects) relative to the projection root
}

export interface SyncTarget {
  platform: PlatformId;
  changes: ChangedPath[]; // target(current) -> source(desired), scoped
  conflict: boolean; // target drifted from its own baseline (needs a per-field pick)
}

export interface SyncAssessment {
  state: SyncState;
  source?: PlatformId;
  changedSince: PlatformId[];
  targets: SyncTarget[];
}

// ---- scoped projection + hash ----

function scopedPerformer(p: Performer): { name: string; aliases: Performer['aliases'] } {
  return { name: p.name, aliases: p.aliases };
}

function scopedSlot(s: Slot): Record<string, unknown> {
  return {
    order: s.order,
    start: s.start,
    end: s.end,
    title: s.title,
    performers: s.performers.map(scopedPerformer),
    vj: s.vj ? scopedPerformer(s.vj) : undefined,
    dancers: s.dancers.map(scopedPerformer),
    genre: s.genre,
    energy: s.energy,
    notes: s.notes,
    publicNote: s.publicNote,
    privateNote: s.privateNote,
  };
}

export interface ScopedProjection {
  details?: {
    title: string;
    description?: string;
    start: string;
    end?: string;
    doorsOpen?: string;
    zone: string;
    flags: Flags;
    music: Music;
    links: Links;
  };
  lineup?: Record<string, unknown>[];
  poster?: PosterRef | null; // never bytes
  publishState?: boolean;
}

// Only the opted-in fields enter the projection. A bytes poster projects as null
// (the pure planner can't diff/carry raw bytes; the engine handles poster bytes).
export function projectScoped(core: EventCore, fields: SyncFields): ScopedProjection {
  const out: ScopedProjection = {};
  if (fields.details) {
    out.details = {
      title: core.title,
      description: core.description,
      start: core.start,
      end: core.end,
      doorsOpen: core.doorsOpen,
      zone: core.zone,
      flags: core.flags,
      music: core.music,
      links: core.links,
    };
  }
  if (fields.lineup) out.lineup = core.lineup.map(scopedSlot);
  if (fields.poster) out.poster = core.poster && core.poster.kind !== 'bytes' ? core.poster : null;
  if (fields.publishState) out.publishState = core.visibility.publish;
  return out;
}

export async function scopedHash(core: EventCore, fields: SyncFields): Promise<string> {
  return hashCanonical(projectScoped(core, fields));
}

// ---- assessment ----

export interface PlanSyncInput {
  link: SyncLink;
  cores: Partial<Record<PlatformId, EventCore>>;
  hashes: Partial<Record<PlatformId, string>>;
}

export function planSync(input: PlanSyncInput): SyncAssessment {
  const { link, cores, hashes } = input;
  const sync = link.sync;
  if (!sync || sync.mode === 'off') return { state: 'off', changedSince: [], targets: [] };
  const fields = sync.fields;

  // Present refs (row loaded) in display order.
  const present = PLATFORM_ORDER.filter((p) => link.refs.some((r) => r.platform === p) && cores[p] && hashes[p]);
  if (present.length < 2) return { state: 'in-sync', changedSince: [], targets: [] };

  const baselineOf = (p: PlatformId): string | undefined => link.lastSynced?.[p]?.hash;
  const changedSince = present.filter((p) => baselineOf(p) !== hashes[p]);
  const anyBaseline = present.some((p) => baselineOf(p) !== undefined);
  const first = present[0]!;
  const allEqual = present.every((p) => hashes[p] === hashes[first]);

  const targetOf = (source: PlatformId, target: PlatformId, conflictOverride?: boolean): SyncTarget => ({
    platform: target,
    changes: diffObjects(projectScoped(cores[target]!, fields), projectScoped(cores[source]!, fields)),
    conflict: conflictOverride ?? changedSince.includes(target),
  });
  const buildTargets = (source: PlatformId, conflictOverride?: boolean): SyncTarget[] =>
    present
      .filter((p) => p !== source)
      .map((t) => targetOf(source, t, conflictOverride))
      .filter((t) => t.changes.length > 0 || t.conflict);

  // Explicit source: propagate that platform to the others; a target that also
  // drifted from its own baseline is a conflict (never auto-applied).
  if (sync.source !== 'last-edited') {
    const source = sync.source;
    if (!present.includes(source)) return { state: 'in-sync', source, changedSince, targets: [] };
    const targets = buildTargets(source);
    let state: SyncState;
    if (targets.some((t) => t.conflict)) state = 'conflict';
    else if (targets.length > 0) state = 'pending';
    else state = 'in-sync';
    return { state, source, changedSince, targets };
  }

  // last-edited.
  if (changedSince.length === 0) return { state: 'in-sync', changedSince, targets: [] };
  if (changedSince.length === 1) {
    const source = changedSince[0]!;
    const targets = buildTargets(source);
    return { state: targets.length ? 'pending' : 'in-sync', source, changedSince, targets };
  }
  // >1 changed.
  if (allEqual) return { state: 'in-sync', changedSince, targets: [] }; // identical content, only a baseline is missing
  if (!anyBaseline) {
    // First run, refs differ -> the user must pick the authoritative source.
    const source = first;
    return { state: 'pick-source', source, changedSince, targets: buildTargets(source, false) };
  }
  // Genuine concurrent drift on >1 ref.
  const source = changedSince[0]!;
  return { state: 'conflict', source, changedSince, targets: buildTargets(source) };
}
