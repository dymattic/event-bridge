// vrc.tl plan/execute. A plan is an ordered list of declarative steps; the
// create flow is create -> detailRead -> detailWrite -> detailReadBack, where
// the write/readback steps reference the id minted by `create` ($ref-style).
// execute(step, ctx) runs one step; runPlan threads results and enforces the
// >=300 ms human-scale gap between consecutive writes.
import type { HttpRequest, HttpResult } from '../../shared/agent-protocol';
import type { EventCore, IanaZone, PosterFile } from '../../core/schema';
import { buildVrctlCreateFields, buildVrctlDetailFields } from '../../core/mapping/to-vrctl';
import type { VrctlField } from '../../core/mapping/to-vrctl';
import type { VrctlDetailForm } from '../../core/mapping/vrctl-types';
import { computeLoss, VRCTL_CAPS } from '../../core/capabilities';
import { BridgeError } from '../../core/errors';
import { asCategoryId, type VrctlCategoryId, type VrctlDeleteAction, type VrctlEventId, type VrctlOrganizerId } from './ids';
import { buildRequest, request } from './routes';
import { buildMultipartBody, encodeUrlencoded, fieldNames, previewFields, toMultipartFields } from './forms';
import { detectNetteError, isSignInRedirect, parseDetailForm } from './parse';

export const DEFAULT_WRITE_DELAY_MS = 300;

export interface VrctlExecCtx {
  send: (req: HttpRequest) => Promise<HttpResult>;
  sendBlob?: (bytes: Uint8Array, mime: string) => Promise<{ blobId: string }>;
  sleep?: (ms: number) => Promise<void>;
  writeDelayMs?: number;
}

// eventId either literal (update/delete) or a reference to a prior step result.
export type EventRef = { kind: 'literal'; id: VrctlEventId } | { kind: 'ref'; step: string };

export type VrctlStep =
  | { id: string; kind: 'create'; organizerId: VrctlOrganizerId; categoryId: VrctlCategoryId; promoted: boolean; fields: [string, string][]; preview: string }
  | { id: string; kind: 'detailRead'; event: EventRef; preview: string }
  | { id: string; kind: 'detailWrite'; event: EventRef; formFrom: string; core: EventCore; publish: boolean; poster?: PosterFile; preview: string }
  | { id: string; kind: 'detailReadBack'; event: EventRef; preview: string }
  | { id: string; kind: 'delete'; action: VrctlDeleteAction; preview: string };

export type StepResult =
  | { kind: 'create'; eventId: VrctlEventId }
  | { kind: 'detailRead'; form: VrctlDetailForm }
  | { kind: 'detailWrite'; sentFieldNames: string[] }
  | { kind: 'detailReadBack'; slotIds: string[]; form: VrctlDetailForm }
  | { kind: 'delete' };

export type StepResults = Record<string, StepResult>;

const DETAIL_ID_RE = /\/admin\/event\/detail\/(\d+)/;

function isWrite(step: VrctlStep): boolean {
  return step.kind === 'create' || step.kind === 'detailWrite' || step.kind === 'delete';
}

function resolveEventId(ref: EventRef, results: StepResults): VrctlEventId {
  if (ref.kind === 'literal') return ref.id;
  const r = results[ref.step];
  if (!r || r.kind !== 'create') throw new BridgeError('UNRESOLVED_REF', `step ${ref.step} has no created event id`);
  return r.eventId;
}

function extractEventId(res: HttpResult): VrctlEventId {
  const loc = res.headers.location;
  const fromLoc = loc ? DETAIL_ID_RE.exec(loc) : null;
  if (fromLoc?.[1]) return fromLoc[1] as VrctlEventId;
  const fromFinal = DETAIL_ID_RE.exec(res.finalUrl);
  if (fromFinal?.[1]) return fromFinal[1] as VrctlEventId;
  throw new BridgeError('PARSE', 'could not extract created event id from create response');
}

function guardSession(res: HttpResult): void {
  if (isSignInRedirect(res)) throw new BridgeError('NOT_LOGGED_IN', 'vrc.tl bounced to sign-in');
}

// Throw VALIDATION before issuing any request if a platform-required field is
// missing (vrc.tl: flags.nsfw / NSFW-SFW). Keeps a create from ever starting.
export function assertWritable(core: EventCore): void {
  const loss = computeLoss(core, VRCTL_CAPS);
  if (loss.required.length) {
    const paths = loss.required.map((r) => r.path).join(', ');
    throw new BridgeError('VALIDATION', `vrc.tl requires: ${paths}`);
  }
}

async function putBlob(ctx: VrctlExecCtx, file: PosterFile): Promise<string> {
  if (!ctx.sendBlob) throw new BridgeError('UNSUPPORTED', 'poster upload needs a sendBlob transport');
  const { blobId } = await ctx.sendBlob(file.bytes, file.mimeType);
  return blobId;
}

export async function execute(step: VrctlStep, ctx: VrctlExecCtx, results: StepResults): Promise<StepResult> {
  switch (step.kind) {
    case 'create': {
      const res = await request(ctx.send, 'create', {
        organizerId: step.organizerId,
        categoryId: step.categoryId,
        promoted: step.promoted,
        body: encodeUrlencoded(step.fields),
      });
      guardSession(res);
      if (res.status >= 400) throw new BridgeError('VALIDATION', `create failed (HTTP ${res.status})`);
      return { kind: 'create', eventId: extractEventId(res) };
    }
    case 'detailRead': {
      const eventId = resolveEventId(step.event, results);
      const res = await request(ctx.send, 'detail', { eventId });
      guardSession(res);
      if (res.status >= 400 || !res.body) throw new BridgeError('NOT_FOUND', `detail read failed (HTTP ${res.status})`);
      return { kind: 'detailRead', form: parseDetailForm(res.body) };
    }
    case 'detailWrite': {
      assertWritable(step.core);
      const eventId = resolveEventId(step.event, results);
      const prior = results[step.formFrom];
      if (!prior || prior.kind !== 'detailRead') throw new BridgeError('UNRESOLVED_REF', `no read form from step ${step.formFrom}`);
      const fields: VrctlField[] = buildVrctlDetailFields(step.core, prior.form, {
        publish: step.publish,
        ...(step.poster ? { poster: step.poster } : {}),
      });
      const body = await buildMultipartBody(toMultipartFields(fields), (f) => putBlob(ctx, f));
      const res = await request(ctx.send, 'detailSubmit', { eventId, body });
      guardSession(res);
      const err = res.body ? detectNetteError(res.body) : null;
      if (err) throw new BridgeError('VALIDATION', `vrc.tl rejected the event: ${err}`);
      if (res.status >= 400) throw new BridgeError('VALIDATION', `detail write failed (HTTP ${res.status})`);
      return { kind: 'detailWrite', sentFieldNames: fieldNames(fields) };
    }
    case 'detailReadBack': {
      const eventId = resolveEventId(step.event, results);
      const res = await request(ctx.send, 'detail', { eventId });
      guardSession(res);
      if (!res.body) throw new BridgeError('PARSE', 'detail read-back returned no body');
      const form = parseDetailForm(res.body);
      return { kind: 'detailReadBack', slotIds: form.slots.map((s) => s.id), form };
    }
    case 'delete': {
      const res = await request(ctx.send, 'delete', { action: step.action });
      guardSession(res);
      if (res.status >= 400) throw new BridgeError('NOT_FOUND', `delete failed (HTTP ${res.status})`);
      return { kind: 'delete' };
    }
  }
}

export async function runPlan(steps: VrctlStep[], ctx: VrctlExecCtx): Promise<StepResults> {
  const results: StepResults = {};
  const sleep = ctx.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const delay = ctx.writeDelayMs ?? DEFAULT_WRITE_DELAY_MS;
  let wrote = false;
  for (const step of steps) {
    if (isWrite(step)) {
      if (wrote && delay > 0) await sleep(delay);
      wrote = true;
    }
    results[step.id] = await execute(step, ctx, results);
  }
  return results;
}

// ---- plan builders ----

export interface PlanCreateOpts {
  organizerId: VrctlOrganizerId;
  categoryId?: VrctlCategoryId;
  promoted?: boolean;
  publish?: boolean;
  poster?: PosterFile;
  timezone?: IanaZone | string;
  duration?: number;
}

function detailPreviewNames(core: EventCore, publish: boolean, poster?: PosterFile): string {
  // Field NAMES are known ahead of the live form; option ids resolve at run time.
  const names = new Set<string>([
    'organizers[]', 'name', 'description', 'instanceOpenMinutesBeforeStart', 'start', 'timezone', 'url',
    'howToJoin', 'showSlots', 'flags[1]', '_submit', '_do',
  ]);
  if (publish) names.add('published');
  if (poster || core.poster) names.add('posterType');
  return `detail POST fields (names): ${[...names].join(', ')} (+ slots[<id>][…], flags[…] from the scraped form)`;
}

export function planCreate(core: EventCore, opts: PlanCreateOpts): VrctlStep[] {
  assertWritable(core); // VALIDATION before any request is issued
  const categoryId = opts.categoryId ?? asCategoryId('1');
  const createFields = buildVrctlCreateFields(core, {
    organizerId: opts.organizerId,
    categoryId,
    ...(opts.timezone ? { timezone: String(opts.timezone) } : {}),
    ...(opts.duration ? { duration: opts.duration } : {}),
  });
  const publish = opts.publish ?? false;
  const create: VrctlStep = {
    id: 'create',
    kind: 'create',
    organizerId: opts.organizerId,
    categoryId,
    promoted: opts.promoted ?? false,
    fields: createFields,
    preview: `create urlencoded: ${createFields.map(([k, v]) => `${k}=${v}`).join('&')}`,
  };
  const ref: EventRef = { kind: 'ref', step: 'create' };
  return [
    create,
    { id: 'detailRead', kind: 'detailRead', event: ref, preview: 'GET detail/<new id>' },
    {
      id: 'detailWrite',
      kind: 'detailWrite',
      event: ref,
      formFrom: 'detailRead',
      core,
      publish,
      ...(opts.poster ? { poster: opts.poster } : {}),
      preview: detailPreviewNames(core, publish, opts.poster),
    },
    { id: 'detailReadBack', kind: 'detailReadBack', event: ref, preview: 'GET detail/<new id> (slot ids)' },
  ];
}

export interface PlanUpdateOpts {
  eventId: VrctlEventId;
  publish?: boolean;
  poster?: PosterFile;
}

export function planUpdate(core: EventCore, opts: PlanUpdateOpts): VrctlStep[] {
  assertWritable(core);
  const publish = opts.publish ?? core.visibility.publish;
  const ref: EventRef = { kind: 'literal', id: opts.eventId };
  return [
    { id: 'detailRead', kind: 'detailRead', event: ref, preview: `GET detail/${opts.eventId}` },
    {
      id: 'detailWrite',
      kind: 'detailWrite',
      event: ref,
      formFrom: 'detailRead',
      core,
      publish,
      ...(opts.poster ? { poster: opts.poster } : {}),
      preview: detailPreviewNames(core, publish, opts.poster),
    },
    { id: 'detailReadBack', kind: 'detailReadBack', event: ref, preview: `GET detail/${opts.eventId} (slot ids)` },
  ];
}

export function planDelete(action: VrctlDeleteAction): VrctlStep[] {
  return [{ id: 'delete', kind: 'delete', action, preview: `GET ${action}` }];
}

export interface PlanPosterOpts {
  eventId: VrctlEventId;
  poster?: PosterFile; // upload (multipart) path
  publicUrl?: string; // posterType=url path when a public URL exists
  publish?: boolean;
}

// posterType=url when a public URL exists, else upload multipart. Poster changes
// go through the full detail POST (vrc.tl has no poster-only endpoint).
export function planPoster(core: EventCore, opts: PlanPosterOpts): VrctlStep[] {
  const next: EventCore = opts.publicUrl
    ? { ...core, poster: { kind: 'url', url: opts.publicUrl } }
    : core;
  return planUpdate(next, {
    eventId: opts.eventId,
    ...(opts.publish !== undefined ? { publish: opts.publish } : {}),
    ...(opts.poster ? { poster: opts.poster } : {}),
  });
}

// Full preview text for a plan (exact-request confirmation before running).
export function renderPlan(steps: VrctlStep[]): string {
  return steps.map((s, i) => `${i + 1}. [${s.kind}] ${s.preview}`).join('\n');
}

export { previewFields };
