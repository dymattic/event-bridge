// PlatformAdapter binding for vrc.tl (the layer the registry consumes). Thin:
// it binds the agent `http` transport (via withAgent) and delegates all logic to
// the pure, unit-tested planner/parsers. Imports the webext runtime, so it is
// NOT node-importable — keep it out of the ./index barrel and out of unit tests.
//
// vrc.tl's write flow (create -> scrape detail form -> multipart detail POST ->
// read back slot ids) can't be one precomputed JsonValue body, so a create plan
// is two PlannedSteps: `vrctl.create` (urlencoded, returns {id}) then
// `vrctl.detailFinalize` (reads the live form, builds the multipart body, posts,
// reads slot ids). Poster BYTES ride setPoster (imperative), like rave.page.
import type { EventCore, PosterFile, PosterRef } from '../../core/schema';
import { computeLoss, VRCTL_CAPS } from '../../core/capabilities';
import { buildVrctlCreateFields } from '../../core/mapping/to-vrctl';
import { ref, resolveRefs, type PlannedStep } from '../../core/planner';
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
import { asCategoryId, asDeleteAction, asEventId, asOrganizerId } from './ids';
import { parseGridDate } from './parse';
import {
  listOwnClubs as ownClubs,
  listOwnEvents as gridRows,
  listGigs as nativeListGigs,
  readEvent as readCore,
  resolvePerformer as performerSearch,
} from './adapter';
import {
  assertWritable,
  DEFAULT_WRITE_DELAY_MS,
  planDelete as planDeleteSteps,
  planPoster as planPosterSteps,
  planUpdate as planUpdateSteps,
  runPlan as runVrctlPlan,
  type VrctlExecCtx,
} from './planner';

const EMPTY_REPORT: PlanResult['report'] = { dropped: [], approximated: [], required: [] };

function deleteActionFor(id: string): string {
  return `/admin/event?grid-grid-__id=${asEventId(id)}&grid-grid-__key=delete&do=grid-grid-actionCallback`;
}

function withVrctl<T>(fn: (ctx: VrctlExecCtx) => Promise<T>): Promise<T> {
  return withAgent(
    'vrctl',
    (agent) => {
      const ctx: VrctlExecCtx = {
        send: (req) => agent.call({ op: 'http', request: req }),
        sendBlob: (bytes, mime) => agent.sendBlob(bytes, mime),
        writeDelayMs: 0, // inter-write spacing is enforced by runPlan below
      };
      return fn(ctx);
    },
    { allowOpen: true },
  );
}

function asObj(v: JsonValue): Record<string, JsonValue> {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) throw new BridgeError('VALIDATION', 'bad vrc.tl step request');
  return v;
}

// Enforces >=ms between resolutions of the returned fn (human-scale third-party
// read spacing). Module-local; unit tests inject a no-op pace instead.
function pacer(ms: number): () => Promise<void> {
  let last = 0;
  return async () => {
    const wait = last + ms - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    last = Date.now();
  };
}

// ---- discovery / read ----

async function session(): Promise<ConnectionStatus> {
  const s = await getSessionStatus('vrctl');
  return {
    connected: s.state === 'logged-in',
    reconnectSoon: false,
    label: s.info?.label,
    expiresAt: s.info?.expiresAt,
  };
}

async function listOwnClubs(): Promise<OwnClub[]> {
  return withVrctl(async (ctx) => {
    const clubs = await ownClubs(ctx.send);
    return clubs.map((c) => ({ id: c.organizerId, organizerType: 'group', name: c.name, vrchatGroupId: c.vrchatGroupId, canOrganize: true }));
  });
}

async function listOwnEvents(organizer: OrganizerFilter): Promise<OwnEvent[]> {
  return withVrctl(async (ctx) => {
    const rows = await gridRows(ctx.send);
    return rows
      .filter((r) => !organizer.organizerId || r.organizerId === organizer.organizerId)
      .map((r) => ({ id: r.eventId, title: r.name, start: parseGridDate(r.start), status: r.promoted ? 'promoted' : undefined, visibility: undefined }));
  });
}

async function listGigs(names: readonly string[], opts?: ListGigsOpts): Promise<Gig[]> {
  // One 300 ms pacer shared by both sources — timeline pages AND detail reads —
  // so the whole pass stays at human scale regardless of how it splits.
  return withVrctl((ctx) => nativeListGigs(ctx.send, names, { now: opts?.now ?? Date.now(), pace: pacer(300) }));
}

async function readEvent(id: string): Promise<EventCore> {
  return withVrctl(async (ctx) => (await readCore(ctx.send, asEventId(id))).core);
}

async function loadVocab(): Promise<AdapterVocab> {
  // vrc.tl has no genre taxonomy (genres are dropped, see caps); tag/timezone
  // vocab is scraped per-event from the detail form (loadVocabForm).
  return { genres: [] };
}

async function resolvePerformer(query: string): Promise<PerformerMatch[]> {
  return withVrctl(async (ctx) => (await performerSearch(ctx.send, query)).map((p) => ({ id: p.id, name: p.text })));
}

// ---- plans (pure) ----

function planCreate(core: EventCore, opts: CreateOpts): PlanResult {
  assertWritable(core); // VALIDATION before any request (vrc.tl requires NSFW/SFW)
  const organizerId = asOrganizerId(opts.organizer.organizerId);
  const categoryId = asCategoryId('1'); // Music (recon default); UI picks via choose-category
  const publish = opts.publish ?? false;
  const fields = buildVrctlCreateFields(core, { organizerId, categoryId });
  const steps: PlannedStep[] = [
    {
      id: 'create',
      platform: 'vrctl',
      kind: 'create',
      routeId: 'vrctl.create',
      request: { organizerId, categoryId, promoted: false, fields } as unknown as JsonValue,
      previewLabel: `Create event "${core.title}"`,
    },
    {
      id: 'finalize',
      platform: 'vrctl',
      kind: 'update',
      routeId: 'vrctl.detailFinalize',
      request: { eventId: ref('create', 'id'), core: core as unknown as JsonValue, publish } as unknown as JsonValue,
      previewLabel: `Set details${publish ? ' + publish to timeline' : ''}`,
    },
  ];
  return { steps, report: computeLoss(core, VRCTL_CAPS) };
}

function planUpdate(core: EventCore, opts: UpdateOpts): PlanResult {
  assertWritable(core);
  const publish = opts.publish ?? core.visibility.publish;
  const steps: PlannedStep[] = [
    {
      id: 'finalize',
      platform: 'vrctl',
      kind: 'update',
      routeId: 'vrctl.detailFinalize',
      request: { eventId: opts.id, core: core as unknown as JsonValue, publish } as unknown as JsonValue,
      previewLabel: `Update event ${opts.id}`,
    },
  ];
  return { steps, report: computeLoss(core, VRCTL_CAPS) };
}

function planDelete(id: string): PlanResult {
  return {
    steps: [
      { id: 'delete', platform: 'vrctl', kind: 'delete', routeId: 'vrctl.delete', request: { eventId: id }, previewLabel: `Delete event ${id}` },
    ],
    report: EMPTY_REPORT,
  };
}

function planPoster(id: string, poster: PosterRef | null): PlanResult {
  const report: PlanResult['report'] = { dropped: [], approximated: [], required: [] };
  if (poster === null) {
    return { steps: [{ id: 'poster', platform: 'vrctl', kind: 'poster', routeId: 'vrctl.posterRemove', request: { eventId: id }, previewLabel: 'Remove poster' }], report };
  }
  if (poster.kind === 'url') {
    return { steps: [{ id: 'poster', platform: 'vrctl', kind: 'poster', routeId: 'vrctl.posterUrl', request: { eventId: id, url: poster.url }, previewLabel: 'Set poster (url)' }], report };
  }
  if (poster.kind === 'bytes') {
    report.approximated.push({ path: 'poster', reason: 'uploaded via multipart (setPoster), not a JSON step' });
  } else {
    report.dropped.push({ path: 'poster', reason: 'vrc.tl poster needs a public URL or an upload' });
  }
  return { steps: [], report };
}

// ---- execute ----

async function executeStep(step: PlannedStep): Promise<JsonValue> {
  const r = asObj(step.request);
  switch (step.routeId) {
    case 'vrctl.create':
      return withVrctl(async (ctx) => {
        const results = await runVrctlPlan(
          [
            {
              id: 'create',
              kind: 'create',
              organizerId: asOrganizerId(String(r.organizerId)),
              categoryId: asCategoryId(String(r.categoryId)),
              promoted: r.promoted === true,
              fields: r.fields as unknown as [string, string][],
              preview: '',
            },
          ],
          ctx,
        );
        const c = results['create'];
        return { id: c && c.kind === 'create' ? c.eventId : '' } as unknown as JsonValue;
      });
    case 'vrctl.detailFinalize':
      return withVrctl(async (ctx) => {
        const eventId = asEventId(String(r.eventId));
        const core = r.core as unknown as EventCore;
        const steps = planUpdateSteps(core, { eventId, publish: r.publish === true });
        const results = await runVrctlPlan(steps, ctx);
        const back = results['detailReadBack'];
        const slotIds = back && back.kind === 'detailReadBack' ? back.slotIds : [];
        return { id: eventId, slotIds } as unknown as JsonValue;
      });
    case 'vrctl.delete':
      return withVrctl(async (ctx) => {
        await runVrctlPlan(planDeleteSteps(asDeleteAction(deleteActionFor(String(r.eventId)))), ctx);
        return null;
      });
    case 'vrctl.posterUrl':
      return withVrctl(async (ctx) => {
        const eventId = asEventId(String(r.eventId));
        const core = (await readCore(ctx.send, eventId)).core;
        await runVrctlPlan(planPosterSteps(core, { eventId, publicUrl: String(r.url), publish: core.visibility.publish }), ctx);
        return null;
      });
    case 'vrctl.posterRemove':
      return withVrctl(async (ctx) => {
        const eventId = asEventId(String(r.eventId));
        const core = (await readCore(ctx.send, eventId)).core;
        await runVrctlPlan(planPosterSteps(core, { eventId, publicUrl: '', publish: core.visibility.publish }), ctx);
        return null;
      });
    default:
      throw new BridgeError('UNSUPPORTED', `unknown vrc.tl route ${step.routeId}`);
  }
}

const WRITE_ROUTES = new Set(['vrctl.create', 'vrctl.detailFinalize', 'vrctl.delete', 'vrctl.posterUrl', 'vrctl.posterRemove']);

// Sequential runner: resolves {$ref} and enforces the >=300 ms human-scale gap
// between consecutive writes (create -> finalize spans two steps).
export async function runPlan(steps: PlannedStep[]): Promise<Record<string, JsonValue>> {
  const results: Record<string, JsonValue> = {};
  const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
  let wrote = false;
  for (const step of steps) {
    if (WRITE_ROUTES.has(step.routeId)) {
      if (wrote) await sleep(DEFAULT_WRITE_DELAY_MS);
      wrote = true;
    }
    results[step.id] = await executeStep(resolveRefs(step, results));
  }
  return results;
}

async function setPoster(id: string, file: PosterFile): Promise<void> {
  await withVrctl(async (ctx) => {
    const eventId = asEventId(id);
    const core = (await readCore(ctx.send, eventId)).core;
    await runVrctlPlan(planPosterSteps(core, { eventId, poster: file, publish: core.visibility.publish }), ctx);
  });
}

async function removePoster(id: string): Promise<void> {
  await withVrctl(async (ctx) => {
    const eventId = asEventId(id);
    const core = (await readCore(ctx.send, eventId)).core;
    await runVrctlPlan(planPosterSteps(core, { eventId, publicUrl: '', publish: core.visibility.publish }), ctx);
  });
}

export const vrctlAdapter: PlatformAdapter = {
  id: 'vrctl',
  caps: VRCTL_CAPS,
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
  execute: executeStep,
  setPoster,
  removePoster,
};
