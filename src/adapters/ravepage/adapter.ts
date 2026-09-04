// rave.page adapter (dev API). Implements PlatformAdapter: session/discovery/read
// via the generated client, and a plan/execute split for writes. Plans are pure
// JSON PlannedStep[] whose slot/performer bodies reference the just-created event
// (and slot) ids via {$ref} placeholders resolved at run time. Poster BYTES are
// uploaded imperatively (setPoster) — not a JSON step.
import type { EventCore, PosterFile, PosterRef } from '../../core/schema';
import { computeLoss } from '../../core/capabilities';
import { fromRavepage } from '../../core/mapping/from-ravepage';
import { toRavepage } from '../../core/mapping/to-ravepage';
import { ref, resolveRefs, type PlannedStep } from '../../core/planner';
import type { JsonValue } from '../../core/hash';
import { BridgeError } from '../../core/errors';
import type {
  AdapterVocab,
  ConnectionStatus,
  CreateOpts,
  OrganizerFilter,
  OwnClub,
  OwnEvent,
  PerformerMatch,
  PlanResult,
  PlatformAdapter,
  UpdateOpts,
} from '../types';
import { ensureConfigured, toBridgeError } from './client';
import { ROUTES } from './routes';
import { caps } from './capabilities';
import { status as authStatus } from './auth';
import { removeEventPoster, setEventPoster } from './upload';
import type { EventCreateIn } from './api-client/models/EventCreateIn';
import type { EntityGenreAssignmentIn } from './api-client/models/EntityGenreAssignmentIn';
import type { EventPerformerCreateIn } from './api-client/models/EventPerformerCreateIn';
import type { EventPosterAssignIn } from './api-client/models/EventPosterAssignIn';
import type { EventSlotCreateIn } from './api-client/models/EventSlotCreateIn';
import type { EventSlotOut } from './api-client/models/EventSlotOut';
import type { EventSlotUpdateIn } from './api-client/models/EventSlotUpdateIn';
import type { EventPerformerOut } from './api-client/models/EventPerformerOut';
import type { EventUpdateIn } from './api-client/models/EventUpdateIn';

const CREATE_STEP = 'create';

// ---- read / discovery ----

// Dedup key that treats a prefixed id (grp_/usr_/club_<uuid>) and its bare-uuid
// form as the same organizer (the two rave.page endpoints disagree on format).
function seenKey(type: string, id: string): string {
  return `${type}:${id.replace(/^(grp|usr|club)_/i, '').toLowerCase()}`;
}

export async function listOwnClubs(): Promise<OwnClub[]> {
  try {
    await ensureConfigured();
    const groups = await ROUTES.getMyGroups({}); // organizer-capable by default
    const out: OwnClub[] = [];
    const seen = new Set<string>();
    for (const g of groups) {
      if (!g.can_organize_events || !g.id) continue;
      out.push({ id: g.id, organizerType: 'group', name: g.name ?? '', vrchatGroupId: g.vrchat_group_id, canOrganize: true });
      seen.add(seenKey('group', g.id));
    }
    // Add user/club organizers the groups list doesn't already cover. /groups/mine
    // returns a prefixed id (grp_<uuid>) while /events/organizers returns the same
    // group as a bare uuid — normalize before the dedup so it isn't listed twice;
    // keep the FIRST (prefixed) entry as canonical, ids as the API returns them.
    const organizers = await ROUTES.listOrganizers();
    for (const o of organizers) {
      const type = o.type ?? 'user';
      if (!o.id || seen.has(seenKey(type, o.id))) continue;
      out.push({ id: o.id, organizerType: type, name: o.name ?? '', canOrganize: true });
      seen.add(seenKey(type, o.id));
    }
    return out;
  } catch (e) {
    throw toBridgeError(e);
  }
}

export async function listOwnEvents(organizer: OrganizerFilter): Promise<OwnEvent[]> {
  try {
    await ensureConfigured();
    const events = await ROUTES.listEvents({ organizerType: organizer.organizerType, organizerId: organizer.organizerId });
    return events.map((e) => ({
      id: e.id ?? '',
      title: e.title ?? '',
      start: e.starts_at,
      status: e.status,
      visibility: e.visibility,
    }));
  } catch (e) {
    throw toBridgeError(e);
  }
}

interface RavepageRaw {
  slots: EventSlotOut[];
  performers: EventPerformerOut[];
}

function rawFrom(core: EventCore): RavepageRaw {
  const ex = core.extras.ravepage;
  if (ex && typeof ex === 'object') {
    const o = ex as { slots?: unknown; performers?: unknown };
    return {
      slots: Array.isArray(o.slots) ? (o.slots as EventSlotOut[]) : [],
      performers: Array.isArray(o.performers) ? (o.performers as EventPerformerOut[]) : [],
    };
  }
  return { slots: [], performers: [] };
}

export async function readEvent(id: string): Promise<EventCore> {
  try {
    await ensureConfigured();
    const [event, slots, performers] = await Promise.all([
      ROUTES.getEvent({ eventId: id }),
      ROUTES.listSlots({ eventId: id }),
      ROUTES.listPerformers({ eventId: id }),
    ]);
    const core = fromRavepage(event, slots, performers);
    // Carry the raw slot/performer rows (with ids) for update reconciliation.
    const prev = core.extras.ravepage && typeof core.extras.ravepage === 'object' ? core.extras.ravepage : {};
    core.extras.ravepage = { ...prev, slots, performers };
    return core;
  } catch (e) {
    throw toBridgeError(e);
  }
}

export async function loadVocab(): Promise<AdapterVocab> {
  try {
    await ensureConfigured();
    const genres = await ROUTES.listGenres();
    return { genres: genres.map((g) => ({ id: g.id ?? '', name: g.name ?? '', slug: g.slug })) };
  } catch (e) {
    throw toBridgeError(e);
  }
}

export async function resolvePerformer(query: string): Promise<PerformerMatch[]> {
  try {
    await ensureConfigured();
    const performers = await ROUTES.searchPerformers({ q: query });
    return performers.map((p) => ({ id: p.id, name: p.name ?? '' }));
  } catch (e) {
    throw toBridgeError(e);
  }
}

// ---- plan builders (pure) ----

function buildCtx(opts: CreateOpts | UpdateOpts): { organizerType: string; organizerId: string; publish: boolean; genreVocab?: Record<string, string> } {
  const organizer = 'organizer' in opts ? opts.organizer : undefined;
  return {
    organizerType: organizer?.organizerType ?? '',
    organizerId: organizer?.organizerId ?? '',
    publish: opts.publish ?? false,
    genreVocab: opts.genreVocab,
  };
}

export function planCreate(core: EventCore, opts: CreateOpts): PlanResult {
  const built = toRavepage(core, {
    organizerType: opts.organizer.organizerType,
    organizerId: opts.organizer.organizerId,
    publish: opts.publish ?? false,
    genreVocab: opts.genreVocab,
  });
  const report = computeLoss(core, caps);
  report.dropped.push(...built.dropped); // vocab-level drops (platform tags, scene/energy)
  const steps: PlannedStep[] = [];

  steps.push({
    id: CREATE_STEP,
    platform: 'ravepage',
    kind: 'create',
    routeId: 'events.create',
    request: built.event as unknown as JsonValue,
    previewLabel: `Create event "${core.title}"`,
  });

  built.slots.forEach((slot, i) => {
    steps.push({
      id: `slot${i}`,
      platform: 'ravepage',
      kind: 'lineup',
      routeId: 'slots.create',
      request: { eventId: ref(CREATE_STEP, 'id'), body: slot as unknown as JsonValue },
      previewLabel: `Add slot ${slot.slot_number ?? i + 1}`,
    });
  });

  built.performers.forEach((pb, i) => {
    const body = { ...pb.performer, slot_id: ref(`slot${pb.slotIndex}`, 'id') } as unknown as JsonValue;
    steps.push({
      id: `perf${i}`,
      platform: 'ravepage',
      kind: 'performer',
      routeId: 'performers.add',
      request: { eventId: ref(CREATE_STEP, 'id'), body },
      previewLabel: `Add performer ${pb.performer.performer_name ?? pb.performer.performer_id ?? ''}`,
    });
  });

  if (built.genreSlugs.length) {
    steps.push({
      id: 'genres',
      platform: 'ravepage',
      kind: 'genres',
      routeId: 'genres.assign',
      request: { eventId: ref(CREATE_STEP, 'id'), body: { genre_slugs: built.genreSlugs } },
      previewLabel: 'Assign genres',
    });
  }

  return { steps, report };
}

// camelCase EventSlotUpdateIn with *Set flags for the fields that changed (P1).
export function slotUpdateShape(next: EventSlotCreateIn, cur: EventSlotOut): EventSlotUpdateIn {
  const out: EventSlotUpdateIn = {};
  if (next.slot_number !== cur.slot_number) {
    out.slotNumber = next.slot_number;
    out.slotNumberSet = true;
  }
  if ((next.slot_title ?? undefined) !== (cur.slot_title ?? undefined)) {
    out.slotTitle = next.slot_title;
    out.slotTitleSet = true;
  }
  if ((next.starts_at ?? undefined) !== (cur.starts_at ?? undefined)) {
    out.startsAt = next.starts_at;
    out.startsAtSet = true;
  }
  if ((next.ends_at ?? undefined) !== (cur.ends_at ?? undefined)) {
    out.endsAt = next.ends_at;
    out.endsAtSet = true;
  }
  return out;
}

export function planUpdate(core: EventCore, opts: UpdateOpts): PlanResult {
  const built = toRavepage(core, buildCtx(opts));
  const report = computeLoss(core, caps);
  report.dropped.push(...built.dropped); // vocab-level drops (platform tags, scene/energy)
  const steps: PlannedStep[] = [];
  const id = opts.id;
  const raw = rawFrom(opts.current);

  // Event PUT: strip organizer mutation (a slug/organizer change is 501).
  const body: EventUpdateIn = { ...built.event };
  delete body.organizer_type;
  delete body.organizer_id;
  steps.push({
    id: 'update',
    platform: 'ravepage',
    kind: 'update',
    routeId: 'events.update',
    request: { eventId: id, body: body as unknown as JsonValue },
    previewLabel: `Update event "${core.title}"`,
  });

  // Slot reconcile by slot_number: patch matching, create new, delete removed.
  const curByNum = new Map<number, EventSlotOut>();
  for (const s of raw.slots) if (s.slot_number != null) curByNum.set(s.slot_number, s);
  const nextNums = new Set(built.slots.map((s) => s.slot_number));
  const slotRef: JsonValue[] = [];
  built.slots.forEach((slot, i) => {
    const existing = slot.slot_number != null ? curByNum.get(slot.slot_number) : undefined;
    if (existing?.id) {
      steps.push({
        id: `uslot${i}`,
        platform: 'ravepage',
        kind: 'lineup',
        routeId: 'slots.update',
        request: { eventId: id, slotId: existing.id, body: slotUpdateShape(slot, existing) as unknown as JsonValue },
        previewLabel: `Update slot ${slot.slot_number ?? i + 1}`,
      });
      slotRef[i] = existing.id;
    } else {
      steps.push({
        id: `uslot${i}`,
        platform: 'ravepage',
        kind: 'lineup',
        routeId: 'slots.create',
        request: { eventId: id, body: slot as unknown as JsonValue },
        previewLabel: `Add slot ${slot.slot_number ?? i + 1}`,
      });
      slotRef[i] = ref(`uslot${i}`, 'id');
    }
  });
  raw.slots
    .filter((s) => s.slot_number == null || !nextNums.has(s.slot_number))
    .forEach((s, i) => {
      if (s.id) {
        steps.push({
          id: `dslot${i}`,
          platform: 'ravepage',
          kind: 'lineup',
          routeId: 'slots.delete',
          request: { eventId: id, slotId: s.id },
          previewLabel: `Delete slot ${s.slot_number ?? ''}`,
        });
      }
    });

  // Performers: replace (delete current, re-add) — simple + correct for a draft.
  raw.performers.forEach((p, i) => {
    if (p.id) {
      steps.push({
        id: `dperf${i}`,
        platform: 'ravepage',
        kind: 'performer',
        routeId: 'performers.delete',
        request: { eventId: id, eventPerformerId: p.id },
        previewLabel: `Remove performer ${p.stage_name ?? p.performer?.name ?? ''}`,
      });
    }
  });
  built.performers.forEach((pb, i) => {
    const body2 = { ...pb.performer, slot_id: slotRef[pb.slotIndex] } as unknown as JsonValue;
    steps.push({
      id: `uperf${i}`,
      platform: 'ravepage',
      kind: 'performer',
      routeId: 'performers.add',
      request: { eventId: id, body: body2 },
      previewLabel: `Add performer ${pb.performer.performer_name ?? pb.performer.performer_id ?? ''}`,
    });
  });

  if (built.genreSlugs.length) {
    steps.push({
      id: 'genres',
      platform: 'ravepage',
      kind: 'genres',
      routeId: 'genres.assign',
      request: { eventId: id, body: { genre_slugs: built.genreSlugs } },
      previewLabel: 'Assign genres',
    });
  }

  return { steps, report };
}

export function planDelete(id: string): PlanResult {
  return {
    steps: [
      {
        id: 'delete',
        platform: 'ravepage',
        kind: 'delete',
        routeId: 'events.delete',
        request: { eventId: id },
        previewLabel: `Delete event ${id}`,
      },
    ],
    report: { dropped: [], approximated: [], required: [] },
  };
}

// URL posters ride on the event body (cover_image_url); bytes are uploaded via
// setPoster (imperative). planPoster handles the JSON-representable cases.
export function planPoster(id: string, poster: PosterRef | null): PlanResult {
  const report: PlanResult['report'] = { dropped: [], approximated: [], required: [] };
  if (poster === null) {
    return {
      steps: [
        { id: 'poster', platform: 'ravepage', kind: 'poster', routeId: 'poster.delete', request: { eventId: id }, previewLabel: 'Remove poster' },
      ],
      report,
    };
  }
  if (poster.kind === 'platform') {
    const body: EventPosterAssignIn = { media_upload_id: poster.ref };
    return {
      steps: [
        { id: 'poster', platform: 'ravepage', kind: 'poster', routeId: 'poster.assign', request: { eventId: id, body: body as unknown as JsonValue }, previewLabel: 'Assign poster' },
      ],
      report,
    };
  }
  if (poster.kind === 'bytes') {
    report.approximated.push({ path: 'poster', reason: 'uploaded via chunked media-upload (setPoster), not a JSON step' });
  }
  return { steps: [], report };
}

// ---- execute ----

function asObj(v: JsonValue): Record<string, JsonValue> {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) throw new BridgeError('VALIDATION', 'bad step request shape');
  return v;
}

export async function executeStep(step: PlannedStep): Promise<JsonValue> {
  try {
    await ensureConfigured();
    switch (step.routeId) {
      case 'events.create':
        return (await ROUTES.createEvent({ requestBody: step.request as unknown as EventCreateIn })) as unknown as JsonValue;
      case 'events.update': {
        const r = asObj(step.request);
        return (await ROUTES.updateEvent({ eventId: r.eventId, requestBody: r.body as unknown as EventUpdateIn })) as unknown as JsonValue;
      }
      case 'events.delete': {
        const r = asObj(step.request);
        await ROUTES.deleteEvent({ eventId: r.eventId });
        return null;
      }
      case 'slots.create': {
        const r = asObj(step.request);
        return (await ROUTES.createSlot({ eventId: r.eventId, requestBody: r.body as unknown as EventSlotCreateIn })) as unknown as JsonValue;
      }
      case 'slots.update': {
        const r = asObj(step.request);
        return (await ROUTES.updateSlot({ eventId: r.eventId, slotId: r.slotId, requestBody: r.body as unknown as EventSlotUpdateIn })) as unknown as JsonValue;
      }
      case 'slots.delete': {
        const r = asObj(step.request);
        await ROUTES.deleteSlot({ eventId: r.eventId, slotId: r.slotId });
        return null;
      }
      case 'performers.add': {
        const r = asObj(step.request);
        return (await ROUTES.addPerformer({ eventId: r.eventId, requestBody: r.body as unknown as EventPerformerCreateIn })) as unknown as JsonValue;
      }
      case 'performers.delete': {
        const r = asObj(step.request);
        await ROUTES.deletePerformer({ eventId: r.eventId, eventPerformerId: r.eventPerformerId });
        return null;
      }
      case 'genres.assign': {
        const r = asObj(step.request);
        // Organizer-facing PUT (setEntityManualGenres); replaces this caller's
        // manual genre tags. The admin-only POST needed admin rights.
        return (await ROUTES.setEntityGenres({ entityType: 'event', entityId: r.eventId, requestBody: r.body as unknown as EntityGenreAssignmentIn })) as unknown as JsonValue;
      }
      case 'poster.assign': {
        const r = asObj(step.request);
        return (await ROUTES.assignPoster({ eventId: r.eventId, requestBody: r.body as unknown as EventPosterAssignIn })) as unknown as JsonValue;
      }
      case 'poster.delete': {
        const r = asObj(step.request);
        await ROUTES.deletePoster({ eventId: r.eventId });
        return null;
      }
      default:
        throw new BridgeError('UNSUPPORTED', `unknown route ${step.routeId}`);
    }
  } catch (e) {
    throw toBridgeError(e);
  }
}

// Sequential runner with {$ref} resolution. rave.page is our own API — no inter-
// step spacing needed, but steps stay ordered.
export async function runPlan(steps: PlannedStep[]): Promise<Record<string, JsonValue>> {
  const results: Record<string, JsonValue> = {};
  for (const step of steps) {
    results[step.id] = await executeStep(resolveRefs(step, results));
  }
  return results;
}

export const ravepageAdapter: PlatformAdapter = {
  id: 'ravepage',
  caps,
  session: (): Promise<ConnectionStatus> => authStatus(),
  listOwnClubs,
  listOwnEvents,
  readEvent,
  loadVocab,
  resolvePerformer,
  planCreate,
  planUpdate,
  planDelete,
  planPoster,
  execute: executeStep,
  setPoster: (id: string, file: PosterFile) => setEventPoster(id, file).then(() => undefined),
  removePoster: removeEventPoster,
};
