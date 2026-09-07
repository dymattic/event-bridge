// vrcpop adapter. All HTTP goes through the agent `http` op inside the user's own
// vrcpop tab (cookies + CSRF); parsing happens here in the dashboard (DOMParser).
// Own-surfaces only: reads come from the user's manage pages, writes carry
// branded ids from those reads. Shaped per the plan's PlatformAdapter sketch
// (id, caps, session, listOwnClubs, listOwnEvents, readEvent, loadVocab,
// resolvePerformer, planCreate/Update/Delete/Poster, execute); once
// src/adapters/types.ts (P3) lands, the lead binds this to PlatformAdapter.
import type { EventCore, IsoUtc } from '../../core/schema';
import type { JsonValue } from '../../core/hash';
import { resolveRefs, type PlannedStep } from '../../core/planner';
import type { SessionInfo } from '../../shared/agent-protocol';
import { BridgeError } from '../../core/errors';
import { dedupeGigs, isUpcomingGig, matchLineupNames, nameMatches, type Gig } from '../../core/gigs';
import { fromVrcpop, type VrcpopDataEvent, type VrcpopLineupBody } from '../../core/mapping/from-vrcpop';
import type { VrcpopEventPayload } from '../../core/mapping/to-vrcpop';

import { request } from './routes';
import { classifyRead, parseReadJson, parseWriteJson } from './http-result';
import {
  parseDashboard,
  parseEditPage,
  parseEventsList,
  parseCsrf,
  parseOwnPerformerSlugs,
  parsePerformerProfile,
  parseVrcpopCardDate,
  type ProfileSet,
} from './parse';
import { makeVocab, parsePerformerSearchAll } from './payloads';
import { planCreate, planDelete, planPoster, planUpdate, type PlanCreateOpts, type PlanPosterOpts, type PlanUpdateOpts } from './planner';
import { vrcpopCaps, type VrcpopCaps } from './capabilities';
import {
  isOwnEventRef,
  isOwnGroupRef,
  ownEventRef,
  performerSlugRef,
  slugifyName,
  type OwnEventRef,
  type OwnGroupRef,
  type PerformerHit,
  type VrcpopAgent,
  type VrcpopClub,
  type VrcpopEventRef,
  type VrcpopVocab,
} from './types';

const WRITE_ROUTES = new Set(['create', 'update', 'delete', 'flyerUpload', 'flyerRemove']);
const DEFAULT_WRITE_DELAY_MS = 300;

const realSleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export interface ExecuteCtx {
  agent: VrcpopAgent;
  csrf?: string; // required once a write step runs
  results?: Record<string, JsonValue>; // prior step results, for {$ref} resolution
  posterBytes?: Uint8Array; // flyer bytes, consumed by flyerUpload steps
  writeDelayMs?: number; // human-scale gap before each write (default 300 ms)
  sleep?: (ms: number) => Promise<void>; // injectable for tests
  timeoutMs?: number;
}

export interface ReadEventResult {
  core: EventCore;
  version: number;
  dataEvent: VrcpopDataEvent;
}

function reqCtx(ctx: ExecuteCtx): { agent: VrcpopAgent; csrf?: string; timeoutMs?: number } {
  return { agent: ctx.agent, csrf: ctx.csrf, timeoutMs: ctx.timeoutMs };
}

function asGroup(v: unknown): OwnGroupRef {
  if (!isOwnGroupRef(v)) throw new BridgeError('NOT_AUTHORIZED', 'step group is not an own-club ref');
  return v;
}
function asEvent(v: unknown): OwnEventRef {
  if (!isOwnEventRef(v)) throw new BridgeError('NOT_AUTHORIZED', 'step event is not an own-event ref');
  return v;
}

// ---- reads ----

async function session(agent: VrcpopAgent): Promise<SessionInfo> {
  return agent.call({ op: 'session' });
}

async function listOwnClubs(agent: VrcpopAgent): Promise<VrcpopClub[]> {
  const res = await request('dashboard', {}, { agent });
  classifyRead(res, 'dashboard');
  return parseDashboard(res.body ?? '').clubs;
}

async function listOwnEvents(agent: VrcpopAgent, group: OwnGroupRef): Promise<VrcpopEventRef[]> {
  const res = await request('eventsList', { group }, { agent });
  classifyRead(res, 'events list');
  return parseEventsList(res.body ?? '').events;
}

async function readEvent(agent: VrcpopAgent, group: OwnGroupRef, event: OwnEventRef): Promise<ReadEventResult> {
  const editRes = await request('editPage', { group, event }, { agent });
  classifyRead(editRes, 'edit page');
  const parsed = parseEditPage(editRes.body ?? '');
  // The lineup fetch enriches each slot with genre/energy that the edit-page
  // data-event lacks. A swallowed failure would drop those fields (fromVrcpop
  // falls back to data-event sets), silently changing the sync-scoped projection
  // between reads and letting apply-mode push a degraded lineup. Fail loud: let
  // the error propagate so assessLink excludes the ref and the editor shows it.
  const lineRes = await request('lineup', { event }, { agent });
  const lineup = parseReadJson(lineRes, 'lineup') as VrcpopLineupBody;
  return { core: fromVrcpop(parsed.dataEvent, lineup), version: parsed.version, dataEvent: parsed.dataEvent };
}

async function loadVocab(agent: VrcpopAgent): Promise<VrcpopVocab> {
  const [g, e] = await Promise.all([request('genres', {}, { agent }), request('energy', {}, { agent })]);
  return makeVocab(parseReadJson(g, 'genres'), parseReadJson(e, 'energy'));
}

async function resolvePerformer(agent: VrcpopAgent, q: string): Promise<PerformerHit[]> {
  const res = await request('performerSearchAll', { q }, { agent });
  return parsePerformerSearchAll(parseReadJson(res, 'performer search'));
}

async function freshCsrf(agent: VrcpopAgent): Promise<string> {
  const res = await request('dashboard', {}, { agent });
  classifyRead(res, 'dashboard (csrf)');
  return parseCsrf(res.body ?? '');
}

// ---- my gigs ----

// Human-scale cap on own-event detail reads per call.
export const MAX_EVENT_READS = 25;

const APP = 'https://vrcpop.com';
const MAX_SLUGS = 5; // profiles read per call (own first)

export interface VrcpopGigsOpts {
  now: number;
  pace: () => Promise<void>; // >=300ms spacer (platform.ts); no-op in tests
  maxEventReads?: number;
}

function profileGig(st: ProfileSet, matchedName: string): Gig {
  // Profile set times ARE the user's slot; the event start is unknown here, so
  // start := setStart (documented on Gig).
  const g: Gig = {
    platform: 'vrcpop',
    eventId: String(st.eventId),
    title: st.title,
    eventUrl: `${APP}${st.eventPath}`,
    start: st.start as IsoUtc,
    setStart: st.start as IsoUtc,
    matchedName,
    status: 'confirmed',
    source: 'profile',
  };
  if (st.clubName) g.clubName = st.clubName;
  if (st.clubPath) g.clubUrl = `${APP}${st.clubPath}`;
  if (st.end) {
    g.end = st.end as IsoUtc;
    g.setEnd = st.end as IsoUtc;
  }
  return g;
}

async function listGigs(agent: VrcpopAgent, names: readonly string[], opts: VrcpopGigsOpts): Promise<Gig[]> {
  if (names.length === 0) return [];
  const { now, pace } = opts;
  const maxReads = opts.maxEventReads ?? MAX_EVENT_READS;

  // 1. dashboard -> own clubs + own performer slugs (+ later the complement scan)
  await pace();
  const dashRes = await request('dashboard', {}, { agent });
  classifyRead(dashRes, 'dashboard');
  const dashHtml = dashRes.body ?? '';
  const clubs = parseDashboard(dashHtml).clubs;
  const ownSlugs = parseOwnPerformerSlugs(dashHtml);

  // 2. resolve profile slugs: own first, then search-all hits matching a name,
  //    plus each name's slugify candidate. Cap MAX_SLUGS total (own first).
  const slugMatched = new Map<string, string>(); // slug -> the typed name
  for (const s of ownSlugs) if (!slugMatched.has(s)) slugMatched.set(s, names[0] ?? '');
  for (const name of names) {
    await pace();
    const res = await request('performerSearchAll', { q: name }, { agent });
    const hits = parsePerformerSearchAll(parseReadJson(res, 'performer search'));
    for (const h of hits) {
      if (!h.slug) continue;
      const m = nameMatches(h.name, names);
      if (m !== null && !slugMatched.has(h.slug)) slugMatched.set(h.slug, m);
    }
    const cand = slugifyName(name);
    if (cand && !slugMatched.has(cand)) slugMatched.set(cand, name);
  }
  const slugs = Array.from(slugMatched.entries()).slice(0, MAX_SLUGS);

  const gigs: Gig[] = [];

  // 3. per slug (paced): read the public profile page; 404 -> skip.
  for (const [slug, matchedName] of slugs) {
    await pace();
    const res = await request('performerProfile', { slug: performerSlugRef(slug) }, { agent });
    if (res.status === 404) continue;
    classifyRead(res, 'performer profile');
    for (const st of parsePerformerProfile(res.body ?? '', now)) {
      gigs.push(profileGig(st, matchedName));
    }
  }

  // 4. complement: own events the user manages whose lineup names a name.
  let reads = 0;
  outer: for (const club of clubs) {
    await pace();
    const evRes = await request('eventsList', { group: club.ref }, { agent });
    classifyRead(evRes, 'events list');
    for (const ev of parseEventsList(evRes.body ?? '').events) {
      if (ev.status === 'past') continue;
      const cardIso = parseVrcpopCardDate(ev.date);
      if (cardIso !== undefined && Date.parse(cardIso) < now) continue; // past card
      if (reads >= maxReads) break outer;
      reads++;
      await pace();
      const { core } = await readEvent(agent, club.ref, ev.ref);
      const match = matchLineupNames(core, names);
      if (!match) continue;
      const id = String(ev.id);
      const g: Gig = {
        platform: 'vrcpop',
        eventId: id,
        title: core.title || ev.title,
        eventUrl: `${APP}/event/${id}`,
        clubName: club.name,
        start: core.start,
        matchedName: match.matchedName,
        status: 'confirmed',
        source: 'own-event',
      };
      if (core.end) g.end = core.end;
      if (match.setStart) g.setStart = match.setStart;
      if (match.setEnd) g.setEnd = match.setEnd;
      gigs.push(g);
    }
  }

  // 5. dedupe (profile wins over own-event for a shared event id) + upcoming.
  return dedupeGigs(gigs).filter((g) => isUpcomingGig(g, now));
}

// ---- execute (one step) ----

async function execute(step: PlannedStep, ctx: ExecuteCtx): Promise<JsonValue> {
  const resolved = ctx.results ? resolveRefs(step, ctx.results) : step;
  const r = resolved.request as {
    group?: unknown;
    event?: unknown;
    body?: unknown;
    filename?: string;
    mime?: string;
  };

  if (WRITE_ROUTES.has(step.routeId)) {
    await (ctx.sleep ?? realSleep)(ctx.writeDelayMs ?? DEFAULT_WRITE_DELAY_MS);
  }

  switch (step.routeId) {
    case 'create': {
      const res = await request('create', { group: asGroup(r.group), body: r.body as VrcpopEventPayload }, reqCtx(ctx));
      const parsed = parseWriteJson(res, 'create');
      const eventId = Number(parsed.event_id);
      if (!Number.isFinite(eventId)) throw new BridgeError('PARSE', 'create: response missing event_id');
      return { success: true, event_id: eventId, event: ownEventRef(eventId) as unknown as JsonValue };
    }
    case 'update': {
      const res = await request('update', { group: asGroup(r.group), event: asEvent(r.event), body: r.body }, reqCtx(ctx));
      parseWriteJson(res, 'update');
      return { success: true };
    }
    case 'delete': {
      const event = asEvent(r.event);
      const res = await request('delete', { event, body: { event_id: event.id } }, reqCtx(ctx));
      parseWriteJson(res, 'delete');
      return { success: true };
    }
    case 'flyerUpload': {
      if (!ctx.posterBytes) throw new BridgeError('VALIDATION', 'flyerUpload: no poster bytes in ctx');
      const mime = r.mime ?? 'application/octet-stream';
      const filename = r.filename ?? 'flyer';
      const { blobId } = await ctx.agent.sendBlob(ctx.posterBytes, mime, { timeoutMs: ctx.timeoutMs });
      const res = await request('flyerUpload', { group: asGroup(r.group), event: asEvent(r.event), blobId, filename, mime }, reqCtx(ctx));
      const parsed = parseWriteJson(res, 'flyer upload');
      return { success: true, flyer_url: String(parsed.flyer_url ?? '') };
    }
    case 'flyerRemove': {
      const res = await request('flyerRemove', { group: asGroup(r.group), event: asEvent(r.event) }, reqCtx(ctx));
      parseWriteJson(res, 'flyer remove');
      return { success: true };
    }
    case 'editPage': {
      const res = await request('editPage', { group: asGroup(r.group), event: asEvent(r.event) }, reqCtx(ctx));
      classifyRead(res, 're-read');
      const parsed = parseEditPage(res.body ?? '');
      return { version: parsed.version, event_id: parsed.eventId };
    }
    default:
      throw new BridgeError('UNSUPPORTED', `execute: unsupported routeId ${step.routeId}`);
  }
}

// P4-local sequential runner: resolves {$ref} across steps, fetches a fresh CSRF
// once when the plan writes, applies the write gap via execute(). P7 owns the
// durable job runner (persistence, retry, rollback); this covers panel + e2e.
async function runPlan(steps: PlannedStep[], ctx: ExecuteCtx): Promise<Record<string, JsonValue>> {
  const results: Record<string, JsonValue> = {};
  let csrf = ctx.csrf;
  if (!csrf && steps.some((s) => WRITE_ROUTES.has(s.routeId))) {
    csrf = await freshCsrf(ctx.agent);
  }
  for (const step of steps) {
    results[step.id] = await execute(step, { ...ctx, csrf, results });
  }
  return results;
}

export interface VrcpopAdapter {
  id: 'vrcpop';
  caps: VrcpopCaps;
  session(agent: VrcpopAgent): Promise<SessionInfo>;
  listOwnClubs(agent: VrcpopAgent): Promise<VrcpopClub[]>;
  listOwnEvents(agent: VrcpopAgent, group: OwnGroupRef): Promise<VrcpopEventRef[]>;
  readEvent(agent: VrcpopAgent, group: OwnGroupRef, event: OwnEventRef): Promise<ReadEventResult>;
  loadVocab(agent: VrcpopAgent): Promise<VrcpopVocab>;
  resolvePerformer(agent: VrcpopAgent, q: string): Promise<PerformerHit[]>;
  listGigs(agent: VrcpopAgent, names: readonly string[], opts: VrcpopGigsOpts): Promise<Gig[]>;
  freshCsrf(agent: VrcpopAgent): Promise<string>;
  planCreate(core: EventCore, opts: PlanCreateOpts): PlannedStep[];
  planUpdate(core: EventCore, opts: PlanUpdateOpts): PlannedStep[];
  planDelete(event: OwnEventRef): PlannedStep[];
  planPoster(core: EventCore, opts: PlanPosterOpts): PlannedStep[];
  execute(step: PlannedStep, ctx: ExecuteCtx): Promise<JsonValue>;
  runPlan(steps: PlannedStep[], ctx: ExecuteCtx): Promise<Record<string, JsonValue>>;
}

export const vrcpopAdapter: VrcpopAdapter = {
  id: 'vrcpop',
  caps: vrcpopCaps,
  session,
  listOwnClubs,
  listOwnEvents,
  readEvent,
  loadVocab,
  resolvePerformer,
  listGigs,
  freshCsrf,
  planCreate,
  planUpdate,
  planDelete,
  planPoster,
  execute,
  runPlan,
};
