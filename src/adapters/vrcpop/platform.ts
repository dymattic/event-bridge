// PlatformAdapter binding for vrcpop (the layer the registry consumes). Thin:
// binds the agent transport via `withAgent` and delegates all logic to the pure,
// unit-tested native adapter (./adapter) + planner. Imports the webext runtime,
// so it is NOT node-importable — kept OUT of ./index (which stays pure) and out
// of unit tests, exactly as P5 did for vrc.tl.
//
// Impedance notes (shared interface uses plain string ids; the native adapter
// uses own-surface brands):
//  - plan* builders are sync, so they mint brands from the opts ids
//    (`ownGroupRef`/`ownEventRef`); the transport layer (routes.ts) still
//    re-checks the brand shape before any request.
//  - readEvent/setPoster/removePoster need the owning club, which the shared
//    interface doesn't carry → `locate()` finds it among the user's OWN clubs.
import type { EventCore, PosterFile, PosterRef } from '../../core/schema';
import { computeLoss, VRCPOP_CAPS, type LossReport } from '../../core/capabilities';
import type { PlannedStep } from '../../core/planner';
import type { JsonValue } from '../../core/hash';
import { BridgeError } from '../../core/errors';
import type {
  AdapterVocab,
  ConnectionStatus,
  CreateOpts,
  ListGigsOpts,
  OrganizerFilter,
  OwnClub,
  OwnEvent,
  PerformerMatch,
  PlanResult,
  PlatformAdapter,
  UpdateOpts,
} from '../types';
import type { Gig } from '../../core/gigs';
import { withAgent } from '../../ui/dashboard/lib/runtime-client';
import { getSessionStatus } from '../../runtime/sessions';
import { vrcpopAdapter as native } from './adapter';
import { vrcpopCaps } from './capabilities';
import { eventToOwn } from './parse';
import {
  ownEventRef,
  ownGroupRef,
  type OwnEventRef,
  type OwnGroupRef,
  type VrcpopAgent,
  type VrcpopClub,
} from './types';

const EMPTY_REPORT: LossReport = { dropped: [], approximated: [], required: [] };

function withVrcpop<T>(fn: (agent: VrcpopAgent) => Promise<T>): Promise<T> {
  return withAgent('vrcpop', (agent) => fn(agent), { allowOpen: true });
}

// Enforces >=ms between resolutions of the returned fn (human-scale third-party
// read spacing). Module-local; unit tests drive the native adapter with a no-op.
function pacer(ms: number): () => Promise<void> {
  let last = 0;
  return async () => {
    const wait = last + ms - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    last = Date.now();
  };
}

function clubToOwn(c: VrcpopClub): OwnClub {
  // vrcpop's grp_ id IS the VRChat group id (cross-platform club anchor).
  return { id: c.groupId, organizerType: 'group', name: c.name, vrchatGroupId: c.groupId, canOrganize: true };
}

function groupRefFor(organizerId: string): OwnGroupRef {
  return ownGroupRef(organizerId, ''); // organizerId originates from listOwnClubs upstream
}

function organizerIdFrom(opts: UpdateOpts, core: EventCore): string {
  return opts.organizer?.organizerId ?? core.organizer.platformIds.vrcpop ?? core.organizer.vrchatGroupId ?? '';
}

// Find the owning club for an event id by scanning the user's OWN clubs/events.
async function locate(agent: VrcpopAgent, id: string): Promise<{ group: OwnGroupRef; event: OwnEventRef }> {
  const eventId = Number(id);
  if (!Number.isFinite(eventId)) throw new BridgeError('VALIDATION', `vrcpop event id must be numeric: ${id}`);
  const clubs = await native.listOwnClubs(agent);
  for (const c of clubs) {
    const events = await native.listOwnEvents(agent, c.ref);
    if (events.some((e) => e.id === eventId)) return { group: c.ref, event: ownEventRef(eventId) };
  }
  throw new BridgeError('NOT_FOUND', `event ${id} not found among own clubs`);
}

// ---- discovery / read ----

async function session(): Promise<ConnectionStatus> {
  const s = await getSessionStatus('vrcpop');
  return {
    connected: s.state === 'logged-in',
    reconnectSoon: false,
    label: s.info?.label,
    expiresAt: s.info?.expiresAt,
  };
}

async function listOwnClubs(): Promise<OwnClub[]> {
  return withVrcpop(async (a) => (await native.listOwnClubs(a)).map(clubToOwn));
}

async function listOwnEvents(organizer: OrganizerFilter): Promise<OwnEvent[]> {
  return withVrcpop(async (a) => (await native.listOwnEvents(a, groupRefFor(organizer.organizerId))).map(eventToOwn));
}

async function readEvent(id: string): Promise<EventCore> {
  return withVrcpop(async (a) => {
    const { group, event } = await locate(a, id);
    return (await native.readEvent(a, group, event)).core;
  });
}

async function loadVocab(): Promise<AdapterVocab> {
  return withVrcpop(async (a) => {
    const v = await native.loadVocab(a);
    return { genres: v.genres.map((g) => ({ id: String(g.id), name: g.name })) };
  });
}

async function resolvePerformer(query: string): Promise<PerformerMatch[]> {
  return withVrcpop(async (a) =>
    (await native.resolvePerformer(a, query)).map((h) => ({ id: h.profileId != null ? String(h.profileId) : undefined, name: h.name })),
  );
}

async function listGigs(names: readonly string[], opts?: ListGigsOpts): Promise<Gig[]> {
  return withVrcpop((a) => native.listGigs(a, names, { now: opts?.now ?? Date.now(), pace: pacer(300) }));
}

// ---- plans (pure) ----

function planCreate(core: EventCore, opts: CreateOpts): PlanResult {
  const steps = native.planCreate(core, { group: groupRefFor(opts.organizer.organizerId), publish: opts.publish ?? false });
  return { steps, report: computeLoss(core, VRCPOP_CAPS) };
}

function planUpdate(core: EventCore, opts: UpdateOpts): PlanResult {
  const group = groupRefFor(organizerIdFrom(opts, core));
  const steps = native.planUpdate(core, { group, event: ownEventRef(Number(opts.id)), publish: opts.publish ?? core.visibility.publish });
  return { steps, report: computeLoss(core, VRCPOP_CAPS) };
}

function planDelete(id: string): PlanResult {
  return { steps: native.planDelete(ownEventRef(Number(id))), report: EMPTY_REPORT };
}

// vrcpop poster set/remove needs a reread version + owning club (async), so it
// rides setPoster/removePoster (imperative) — planPoster reports the loss only,
// mirroring vrc.tl.
function planPoster(_id: string, poster: PosterRef | null): PlanResult {
  const report: LossReport = { dropped: [], approximated: [], required: [] };
  if (poster === null) {
    report.approximated.push({ path: 'poster', reason: 'flyer removed imperatively via removePoster' });
  } else if (poster.kind === 'bytes') {
    report.approximated.push({ path: 'poster', reason: 'uploaded via multipart flyer (setPoster), not a JSON step' });
  } else {
    report.dropped.push({ path: 'poster', reason: 'vrcpop poster needs an upload; url/platform ref unsupported' });
  }
  return { steps: [], report };
}

// ---- execute ----

// Single-step execute routes through the native runPlan so a lone write step
// still gets a fresh CSRF; $ref resolution is a no-op for a one-step plan.
async function execute(step: PlannedStep): Promise<JsonValue> {
  return withVrcpop(async (a) => {
    const results = await native.runPlan([step], { agent: a });
    return results[step.id] ?? null;
  });
}

async function setPoster(id: string, file: PosterFile): Promise<void> {
  await withVrcpop(async (a) => {
    const { group, event } = await locate(a, id);
    const { core } = await native.readEvent(a, group, event);
    const steps = native.planPoster(core, { group, event, publish: core.visibility.publish, poster: { filename: file.filename, mime: file.mimeType } });
    await native.runPlan(steps, { agent: a, posterBytes: file.bytes });
  });
}

async function removePoster(id: string): Promise<void> {
  await withVrcpop(async (a) => {
    const { group, event } = await locate(a, id);
    const { core } = await native.readEvent(a, group, event);
    const steps = native.planPoster(core, { group, event, publish: core.visibility.publish, poster: { remove: true } });
    await native.runPlan(steps, { agent: a });
  });
}

export const vrcpopAdapter: PlatformAdapter = {
  id: 'vrcpop',
  caps: vrcpopCaps,
  session,
  listOwnClubs,
  listOwnEvents,
  listGigs,
  readEvent,
  loadVocab,
  resolvePerformer,
  planCreate,
  planUpdate,
  planDelete,
  planPoster,
  execute,
  setPoster,
  removePoster,
};
