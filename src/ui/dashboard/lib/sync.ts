// Sync engine (webext-bound). Assess a link (read each ref's core, hash, planSync),
// apply a source's scoped fields to the other refs (recording a `sync` job), set a
// baseline, and run a sequential pass over links. Runs ONLY while the dashboard is
// open — on Events load, Refresh, or after a local write. NEVER from timers/alarms/
// background. Conflicts are never auto-applied; a public-publish flip needs a prior
// confirmation (publishConfirmed) so an automatic pass can't publish silently.
//
// Wraps the adapter registry + runtime stores -> NOT node-importable; render tests
// mock it.
import type { EventCore, PlatformId, PosterFile, PosterRef } from '../../../core/schema';
import { CAPS, computeLoss } from '../../../core/capabilities';
import { isBridgeError } from '../../../core/errors';
import type { Platform } from '../../../shared/agent-protocol';
import { getAdapter } from '../../../adapters/registry';
import type { VocabEntry } from '../../../adapters/types';
import { listLinks, saveLink, type EventLink } from '../../../runtime/link-store';
import { getSettings, type Settings } from '../../../runtime/settings';
import {
  planSync,
  projectScoped,
  scopedHash,
  type LinkSync,
  type SyncAssessment,
  type SyncFields,
} from '../../lib/sync-plan';
import { PLATFORM_ORDER } from '../../lib/platform-meta';
import { loadGenreVocab, paceHost, readEventCore } from './event-data';
import { runPlan, type StepEvent } from './run-plan';
import { startJobRun } from './job-recorder';

export type SyncResolutions = Partial<Record<Platform, Record<string, 'source' | 'target'>>>;

export interface AssessedLink {
  link: EventLink; // the link (with effective sync) this reflects
  assessment: SyncAssessment;
  cores: Partial<Record<Platform, EventCore>>;
  hashes: Partial<Record<Platform, string>>;
  sync: LinkSync;
  title: string; // resolved title (source or first present core), for the UI/job
}

export interface ApplyTargetResult {
  platform: Platform;
  ok: boolean;
  skipped?: 'conflict' | 'needs-resolution';
  error?: string;
}

export interface ApplyOutcome {
  jobId?: string;
  results: ApplyTargetResult[];
  link: EventLink; // the link after apply (fresh sync + baselines)
}

function errMessage(e: unknown): string {
  if (isBridgeError(e)) return `${e.code}: ${e.message}`;
  return e instanceof Error ? e.message : String(e);
}

// link.sync when set, else the settings default (a pre-P7 link inherits it).
export function effectiveSync(link: EventLink, settings: Settings): LinkSync {
  return link.sync ?? settings.sync;
}

function genreVocabMap(entries: VocabEntry[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const g of entries) if (g.slug) out[g.name.toLowerCase()] = g.slug;
  return out;
}

async function loadGenreVocabSafe(platform: Platform): Promise<Record<string, string>> {
  try {
    return genreVocabMap(await loadGenreVocab(platform));
  } catch {
    return {};
  }
}

// ---- assessment ----

export async function assessLink(link: EventLink, settings: Settings, connected: Platform[]): Promise<AssessedLink> {
  const sync = effectiveSync(link, settings);
  const cores: Partial<Record<Platform, EventCore>> = {};
  const hashes: Partial<Record<Platform, string>> = {};
  if (sync.mode !== 'off') {
    for (const p of PLATFORM_ORDER) {
      const ref = link.refs.find((r) => r.platform === p);
      if (!ref || !connected.includes(p)) continue;
      try {
        const core = await readEventCore(p, ref.id);
        cores[p] = core;
        hashes[p] = await scopedHash(core, sync.fields);
      } catch {
        // unreadable ref (deleted / not permitted) -> excluded from the assessment
      }
    }
  }
  const withSync: EventLink = { ...link, sync };
  const assessment = planSync({ link: withSync, cores, hashes });
  const source = assessment.source;
  const title = (source && cores[source]?.title) || PLATFORM_ORDER.map((p) => cores[p]?.title).find(Boolean) || '';
  return { link: withSync, assessment, cores, hashes, sync, title };
}

// ---- apply ----

function clone(core: EventCore): EventCore {
  return structuredClone(core);
}

// Source's DEFINED keys win; keys the source doesn't represent keep the target's
// value (a platform that can't express a field — vrcpop has no per-event NSFW —
// must not wipe the target's required value).
function mergeDefined<T>(target: T, source: T): T {
  const out: Record<string, unknown> = { ...(target as Record<string, unknown>) };
  for (const [k, v] of Object.entries(source as Record<string, unknown>)) if (v !== undefined) out[k] = v;
  return out as T;
}

// Overwrite the target's in-scope fields from the source, gap-filling so a field
// the source can't represent keeps the target's value (see mergeDefined).
function mergeScoped(target: EventCore, source: EventCore, fields: SyncFields): EventCore {
  const merged = clone(target);
  if (fields.details) {
    merged.title = source.title; // required — source is authoritative
    merged.start = source.start;
    merged.zone = source.zone;
    if (source.description !== undefined) merged.description = source.description;
    if (source.end !== undefined) merged.end = source.end;
    if (source.doorsOpen !== undefined) merged.doorsOpen = source.doorsOpen;
    merged.flags = mergeDefined(structuredClone(target.flags), structuredClone(source.flags));
    merged.music = mergeDefined(structuredClone(target.music), structuredClone(source.music));
    merged.links = mergeDefined(structuredClone(target.links), structuredClone(source.links));
  }
  if (fields.lineup) merged.lineup = structuredClone(source.lineup);
  if (fields.poster) merged.poster = source.poster && source.poster.kind !== 'bytes' ? structuredClone(source.poster) : merged.poster;
  return merged;
}

// A projection dot-path -> the core segments it addresses.
function coreSegments(path: string): string[] {
  const segs = path.split('.');
  const root = segs[0];
  if (root === 'details') return segs.slice(1);
  if (root === 'lineup') return segs; // same shape as core.lineup
  if (root === 'poster') return ['poster'];
  if (root === 'publishState') return ['visibility', 'publish'];
  return segs;
}

function getAt(obj: unknown, segs: string[]): unknown {
  let cur: unknown = obj;
  for (const s of segs) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[s];
  }
  return cur;
}

function setAt(obj: unknown, segs: string[], value: unknown): void {
  let cur = obj as Record<string, unknown>;
  for (let i = 0; i < segs.length - 1; i++) {
    const s = segs[i]!;
    if (cur[s] == null || typeof cur[s] !== 'object') cur[s] = {};
    cur = cur[s] as Record<string, unknown>;
  }
  cur[segs[segs.length - 1]!] = value;
}

// Per-field merge for a conflict target: start from the target, then for each
// changed path resolved to 'source' copy that value in; 'target' keeps its own.
function mergeResolved(
  target: EventCore,
  source: EventCore,
  changes: { path: string }[],
  resolution: Record<string, 'source' | 'target'>,
): EventCore {
  const merged = clone(target);
  for (const c of changes) {
    if (resolution[c.path] !== 'source') continue;
    const segs = coreSegments(c.path);
    setAt(merged, segs, structuredClone(getAt(source, segs)));
  }
  return merged;
}

// Auto-resolve exact case-insensitive performer name matches on a required
// target (vrc.tl). Only exact matches are adopted; anything unresolved is left
// for the editor's PerformerResolver (the sync apply refuses to write it).
async function autoResolvePerformers(platform: Platform, core: EventCore): Promise<EventCore> {
  const adapter = getAdapter(platform);
  const lineup = await Promise.all(
    core.lineup.map(async (slot) => {
      const performers = await Promise.all(
        slot.performers.map(async (p) => {
          if (p.aliases.some((a) => a.platform === platform && a.id)) return p;
          try {
            await paceHost(platform);
            const matches = await adapter.resolvePerformer(p.name);
            const hit = matches.find((m) => m.id && m.name.trim().toLowerCase() === p.name.trim().toLowerCase());
            if (hit) return { ...p, aliases: [...p.aliases, { platform, id: hit.id, name: hit.name }] };
          } catch {
            // degrade: leave unresolved
          }
          return p;
        }),
      );
      return { ...slot, performers };
    }),
  );
  return { ...core, lineup };
}

function unresolvedPerformers(platform: Platform, core: EventCore): boolean {
  if (CAPS[platform].performerIds !== 'required') return false;
  return computeLoss(core, CAPS[platform]).required.some((r) => /^lineup\.\d+\.(performers\.\d+|vj)$/.test(r.path));
}

async function fetchPosterFile(url: string): Promise<PosterFile | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    const mimeType = res.headers.get('content-type') ?? 'image/jpeg';
    return { bytes: buf, mimeType, filename: url.split('/').pop() || 'poster' };
  } catch {
    return null;
  }
}

async function applyPosterSync(platform: Platform, id: string, poster: PosterRef | undefined, onStep: (evt: StepEvent) => void): Promise<void> {
  if (!poster || poster.kind === 'bytes') return; // bytes never cross the pure sync path
  const caps = CAPS[platform];
  if (poster.kind === 'url') {
    if (caps.posterUrl) {
      const pp = getAdapter(platform).planPoster(id, poster);
      if (pp.steps.length) await runPlan(platform, pp.steps, { onStep });
    } else if (caps.posterUpload) {
      const file = await fetchPosterFile(poster.url);
      if (file) await getAdapter(platform).setPoster(id, file);
    }
  }
}

export interface ApplySyncOpts {
  source: Platform;
  settings: Settings;
  resolutions?: SyncResolutions;
  auto?: boolean; // an automatic pass may not flip publish to public without confirmation
}

export async function applySync(link: EventLink, assessed: AssessedLink, opts: ApplySyncOpts): Promise<ApplyOutcome> {
  const sync = effectiveSync(link, opts.settings);
  const fields = sync.fields;
  const source = opts.source;
  const sourceCore = assessed.cores[source];
  if (!sourceCore) return { results: [], link };

  // Actionable = non-conflict targets, plus conflict targets whose every changed
  // path has a resolution.
  const actionable = assessed.assessment.targets.filter((t) => {
    if (!t.conflict) return true;
    const res = opts.resolutions?.[t.platform];
    return !!res && t.changes.every((c) => res[c.path] !== undefined);
  });
  const skipped: ApplyTargetResult[] = assessed.assessment.targets
    .filter((t) => !actionable.includes(t))
    .map((t) => ({ platform: t.platform, ok: false, skipped: 'conflict' as const }));
  if (actionable.length === 0) return { results: skipped, link };

  const job = await startJobRun({
    kind: 'sync',
    title: sourceCore.title,
    targets: actionable.map((t) => t.platform),
    refs: link.refs,
  });

  const results: ApplyTargetResult[] = [];
  const freshHashes: Partial<Record<Platform, string>> = { ...assessed.hashes };

  for (const t of actionable) {
    const targetRef = link.refs.find((r) => r.platform === t.platform);
    const targetCore = assessed.cores[t.platform];
    if (!targetRef || !targetCore) continue;
    const onStep = job.stepRecorder(t.platform);
    try {
      let merged = t.conflict
        ? mergeResolved(targetCore, sourceCore, t.changes, opts.resolutions?.[t.platform] ?? {})
        : mergeScoped(targetCore, sourceCore, fields);

      if (fields.lineup && CAPS[t.platform].performerIds === 'required') {
        merged = await autoResolvePerformers(t.platform, merged);
        if (unresolvedPerformers(t.platform, merged)) {
          results.push({ platform: t.platform, ok: false, skipped: 'needs-resolution' });
          continue;
        }
      }

      const wantPublish = fields.publishState ? sourceCore.visibility.publish : targetCore.visibility.publish;
      const goingPublic = wantPublish && !targetCore.visibility.publish;
      const publish = goingPublic && opts.auto && !sync.publishConfirmed ? targetCore.visibility.publish : wantPublish;
      merged.visibility = { ...merged.visibility, publish };

      const genreVocab = await loadGenreVocabSafe(t.platform);
      const plan = getAdapter(t.platform).planUpdate(merged, { id: targetRef.id, current: targetCore, publish, genreVocab });
      const out = await runPlan(t.platform, plan.steps, { onStep });
      if (!out.ok) {
        results.push({ platform: t.platform, ok: false, error: out.error ? errMessage(out.error) : 'step failed' });
        continue;
      }
      if (fields.poster) await applyPosterSync(t.platform, targetRef.id, sourceCore.poster, onStep).catch(() => undefined);

      const fresh = await readEventCore(t.platform, targetRef.id)
        .then((c) => scopedHash(c, fields))
        .catch(() => undefined);
      if (fresh) freshHashes[t.platform] = fresh;
      results.push({ platform: t.platform, ok: true });
    } catch (e) {
      results.push({ platform: t.platform, ok: false, error: errMessage(e) });
    }
  }

  // Baseline: source + every written target adopt their fresh hash; skipped
  // targets keep their old baseline so they still surface as pending/conflict.
  const lastSynced: EventLink['lastSynced'] = { ...(link.lastSynced ?? {}) };
  const now = new Date().toISOString();
  if (freshHashes[source]) lastSynced[source] = { hash: freshHashes[source]!, at: now };
  for (const r of results) if (r.ok && freshHashes[r.platform]) lastSynced[r.platform] = { hash: freshHashes[r.platform]!, at: now };
  const savedLink: EventLink = { ...link, sync, lastSynced };
  await saveLink(savedLink);

  const failed = results.some((r) => !r.ok && !r.skipped);
  await job.finish(failed ? 'failed' : 'done', link.refs);
  return { jobId: job.id, results: [...results, ...skipped], link: savedLink };
}

// Record the current scoped hashes as the baseline WITHOUT any platform write.
export async function setBaseline(link: EventLink, settings: Settings, connected: Platform[]): Promise<EventLink> {
  const assessed = await assessLink(link, settings, connected);
  const lastSynced: EventLink['lastSynced'] = { ...(link.lastSynced ?? {}) };
  const now = new Date().toISOString();
  for (const p of PLATFORM_ORDER) if (assessed.hashes[p]) lastSynced[p] = { hash: assessed.hashes[p]!, at: now };
  const savedLink: EventLink = { ...link, sync: assessed.sync, lastSynced };
  await saveLink(savedLink);
  return savedLink;
}

// Sequential pass over the in-scope links (anchorIds) with mode != off: notify ->
// assess only; apply -> assess then apply the non-conflicting targets immediately.
// Reads links fresh from storage (so it reflects a just-applied baseline) and
// returns the per-link assessment map for the UI (keyed by anchorId). Callers
// pass only the anchorIds in the current time scope (past events are skipped
// unless the user opens the Sheet). Never self-invalidates (avoids a resource race).
export async function runSyncPass(anchorIds: string[], connected: Platform[]): Promise<Record<string, AssessedLink>> {
  const settings = await getSettings();
  const inScope = new Set(anchorIds);
  const links = (await listLinks()).filter((l) => inScope.has(l.anchorId));
  const out: Record<string, AssessedLink> = {};
  for (const link of links) {
    const sync = effectiveSync(link, settings);
    if (sync.mode === 'off') continue; // no assessment, no reads
    let assessed = await assessLink(link, settings, connected);
    out[link.anchorId] = assessed;
    if (sync.mode === 'apply' && assessed.assessment.state === 'pending' && assessed.assessment.source) {
      const outcome = await applySync(link, assessed, { source: assessed.assessment.source, settings, auto: true });
      assessed = await assessLink(outcome.link, settings, connected); // refresh post-apply (fresh baseline)
      out[link.anchorId] = assessed;
    }
  }
  return out;
}
