// vrcpop plan builders. Pure: turn an EventCore + intent into an ordered list of
// PlannedSteps whose request bodies may reference earlier results via {$ref}
// (core planner). The dashboard renders the exact requests; the user confirms;
// then the adapter's execute()/runPlan() runs them.
//
// Poster + update flows re-read the optimistic-lock version as their FIRST write
// dependency: a `reread` step (GET editPage) yields {version}, referenced by the
// update body — so we always write against the version the server holds now.
import type { EventCore } from '../../core/schema';
import type { JsonValue } from '../../core/hash';
import { ref, type PlannedStep } from '../../core/planner';
import { toVrcpopPayload, type VrcpopVocabItem } from '../../core/mapping/to-vrcpop';
import type { OwnEventRef, OwnGroupRef } from './types';

export interface PosterIntent {
  filename: string;
  mime: string;
}

export interface PlanVocab {
  genres?: VrcpopVocabItem[];
  energies?: VrcpopVocabItem[];
}

export interface PlanCreateOpts {
  group: OwnGroupRef;
  publish: boolean;
  vocab?: PlanVocab;
  poster?: PosterIntent;
}

export interface PlanUpdateOpts {
  group: OwnGroupRef;
  event: OwnEventRef;
  publish: boolean;
  vocab?: PlanVocab;
  poster?: PosterIntent;
}

function createBody(core: EventCore, group: OwnGroupRef, publish: boolean, vocab?: PlanVocab): JsonValue {
  const payload = toVrcpopPayload(core, { groupId: group.id, ownerTimezone: core.zone, publish, vocab });
  return payload as unknown as JsonValue;
}

// Full update payload with event_id/version (and optionally flyer_url) supplied as
// values or {$ref} placeholders resolved at run time.
function updateBody(
  core: EventCore,
  group: OwnGroupRef,
  publish: boolean,
  eventId: JsonValue,
  version: JsonValue,
  flyerUrl: JsonValue | undefined,
  vocab?: PlanVocab,
): JsonValue {
  const base = toVrcpopPayload(core, { groupId: group.id, ownerTimezone: core.zone, publish, eventId: 0, version: 0, vocab });
  const obj = { ...(base as unknown as Record<string, JsonValue>) };
  obj.event_id = eventId;
  obj.version = version;
  if (flyerUrl !== undefined) obj.flyer_url = flyerUrl;
  return obj;
}

const publishLabel = (publish: boolean): string => (publish ? 'PUBLISH (public immediately)' : 'draft');

export function planCreate(core: EventCore, opts: PlanCreateOpts): PlannedStep[] {
  const steps: PlannedStep[] = [
    {
      id: 'create',
      platform: 'vrcpop',
      kind: 'create',
      routeId: 'create',
      request: { group: opts.group as unknown as JsonValue, body: createBody(core, opts.group, opts.publish, opts.vocab) },
      previewLabel: `Create event (${publishLabel(opts.publish)})`,
    },
  ];
  if (opts.poster) {
    const eventRef = ref('create', 'event');
    steps.push({
      id: 'flyerUpload',
      platform: 'vrcpop',
      kind: 'poster',
      routeId: 'flyerUpload',
      request: { group: opts.group as unknown as JsonValue, event: eventRef, filename: opts.poster.filename, mime: opts.poster.mime },
      previewLabel: 'Upload flyer',
    });
    steps.push({
      id: 'reread',
      platform: 'vrcpop',
      kind: 'update',
      routeId: 'editPage',
      request: { group: opts.group as unknown as JsonValue, event: eventRef },
      previewLabel: 'Re-read current version',
    });
    steps.push({
      id: 'update',
      platform: 'vrcpop',
      kind: 'update',
      routeId: 'update',
      request: {
        group: opts.group as unknown as JsonValue,
        event: eventRef,
        body: updateBody(core, opts.group, opts.publish, ref('create', 'event_id'), ref('reread', 'version'), ref('flyerUpload', 'flyer_url'), opts.vocab),
      },
      previewLabel: 'Attach flyer to event',
    });
  }
  return steps;
}

export function planUpdate(core: EventCore, opts: PlanUpdateOpts): PlannedStep[] {
  const eventRef = opts.event as unknown as JsonValue;
  const steps: PlannedStep[] = [
    {
      id: 'reread',
      platform: 'vrcpop',
      kind: 'update',
      routeId: 'editPage',
      request: { group: opts.group as unknown as JsonValue, event: eventRef },
      previewLabel: 'Re-read current version',
    },
  ];
  let flyerUrlRef: JsonValue | undefined;
  if (opts.poster) {
    steps.push({
      id: 'flyerUpload',
      platform: 'vrcpop',
      kind: 'poster',
      routeId: 'flyerUpload',
      request: { group: opts.group as unknown as JsonValue, event: eventRef, filename: opts.poster.filename, mime: opts.poster.mime },
      previewLabel: 'Upload flyer',
    });
    flyerUrlRef = ref('flyerUpload', 'flyer_url');
  }
  steps.push({
    id: 'update',
    platform: 'vrcpop',
    kind: 'update',
    routeId: 'update',
    request: {
      group: opts.group as unknown as JsonValue,
      event: eventRef,
      body: updateBody(core, opts.group, opts.publish, opts.event.id, ref('reread', 'version'), flyerUrlRef, opts.vocab),
    },
    previewLabel: `Update event (${publishLabel(opts.publish)})`,
  });
  return steps;
}

export function planDelete(event: OwnEventRef): PlannedStep[] {
  return [
    {
      id: 'delete',
      platform: 'vrcpop',
      kind: 'delete',
      routeId: 'delete',
      request: { event: event as unknown as JsonValue, body: { event_id: event.id } },
      previewLabel: 'Delete event (soft, 30-day undo)',
    },
  ];
}

export interface PlanPosterOpts {
  group: OwnGroupRef;
  event: OwnEventRef;
  publish: boolean;
  vocab?: PlanVocab;
  poster: PosterIntent | { remove: true };
}

// Set = reread + flyerUpload + update(flyer_url). Remove = single DELETE
// upload-flyer.php (server clears it).
export function planPoster(core: EventCore, opts: PlanPosterOpts): PlannedStep[] {
  if ('remove' in opts.poster) {
    return [
      {
        id: 'flyerRemove',
        platform: 'vrcpop',
        kind: 'poster',
        routeId: 'flyerRemove',
        request: { group: opts.group as unknown as JsonValue, event: opts.event as unknown as JsonValue },
        previewLabel: 'Remove flyer',
      },
    ];
  }
  return planUpdate(core, { group: opts.group, event: opts.event, publish: opts.publish, vocab: opts.vocab, poster: opts.poster });
}
