// vrcpop adapter. All HTTP goes through the agent `http` op inside the user's own
// vrcpop tab (cookies + CSRF); parsing happens here in the dashboard (DOMParser).
// Own-surfaces only: reads come from the user's manage pages, writes carry
// branded ids from those reads. Shaped per the plan's PlatformAdapter sketch
// (id, caps, session, listOwnClubs, listOwnEvents, readEvent, loadVocab,
// resolvePerformer, planCreate/Update/Delete/Poster, execute); once
// src/adapters/types.ts (P3) lands, the lead binds this to PlatformAdapter.
import type { EventCore } from '../../core/schema';
import type { JsonValue } from '../../core/hash';
import { resolveRefs, type PlannedStep } from '../../core/planner';
import type { SessionInfo } from '../../shared/agent-protocol';
import { BridgeError } from '../../core/errors';
import { fromVrcpop, type VrcpopDataEvent, type VrcpopLineupBody } from '../../core/mapping/from-vrcpop';
import type { VrcpopEventPayload } from '../../core/mapping/to-vrcpop';

import { request } from './routes';
import { classifyRead, parseReadJson, parseWriteJson } from './http-result';
import { parseDashboard, parseEditPage, parseEventsList, parseCsrf } from './parse';
import { makeVocab, parsePerformerSearchAll } from './payloads';
import { planCreate, planDelete, planPoster, planUpdate, type PlanCreateOpts, type PlanPosterOpts, type PlanUpdateOpts } from './planner';
import { vrcpopCaps, type VrcpopCaps } from './capabilities';
import {
  isOwnEventRef,
  isOwnGroupRef,
  ownEventRef,
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
  let lineup: VrcpopLineupBody | undefined;
  try {
    const lineRes = await request('lineup', { event }, { agent });
    lineup = parseReadJson(lineRes, 'lineup') as VrcpopLineupBody;
  } catch {
    lineup = undefined; // edit-page data-event is sufficient; lineup only enriches genres
  }
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
  freshCsrf,
  planCreate,
  planUpdate,
  planDelete,
  planPoster,
  execute,
  runPlan,
};
