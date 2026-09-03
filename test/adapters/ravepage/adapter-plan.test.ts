import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock webext (module load) + ROUTES (executeStep dispatch). Plan builders are
// pure and don't touch ROUTES.
const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

const rec = vi.hoisted(() => ({ calls: [] as { name: string; arg: Record<string, unknown> }[] }));
vi.mock('../../../src/adapters/ravepage/routes', () => {
  const make = (name: string, result: unknown) => (arg: Record<string, unknown>) => {
    rec.calls.push({ name, arg });
    return Promise.resolve(result);
  };
  return {
    ROUTES: {
      createEvent: make('createEvent', { id: 'evt_new' }),
      updateEvent: make('updateEvent', { id: 'evt_new' }),
      deleteEvent: make('deleteEvent', undefined),
      createSlot: make('createSlot', { id: 'slt_new' }),
      updateSlot: make('updateSlot', { id: 'slt_upd' }),
      deleteSlot: make('deleteSlot', undefined),
      addPerformer: make('addPerformer', { id: 'ep_new' }),
      deletePerformer: make('deletePerformer', undefined),
      assignEventGenres: make('assignEventGenres', { ok: true }),
      assignPoster: make('assignPoster', {}),
      deletePoster: make('deletePoster', undefined),
    },
  };
});

import {
  executeStep,
  planCreate,
  planDelete,
  planPoster,
  planUpdate,
  runPlan,
  slotUpdateShape,
} from '../../../src/adapters/ravepage/adapter';
import type { EventCore, Performer, Slot } from '../../../src/core/schema';
import { asIanaZone, asIsoUtc } from '../../../src/core/time';
import type { PlannedStep } from '../../../src/core/planner';
import { createFake } from '../../runtime/fake-ext';

const START = asIsoUtc('2026-10-01T22:00:00.000Z');
const END = asIsoUtc('2026-10-02T02:00:00.000Z');

function dj(name: string): Performer {
  return { name, aliases: [{ platform: 'ravepage', name }] };
}

function core(over: Partial<EventCore> = {}): EventCore {
  const slot: Slot = { order: 1, start: START, end: END, title: 'Main', performers: [dj('A'), dj('B')], dancers: [] };
  return {
    title: 'Test Rave',
    start: START,
    end: END,
    zone: asIanaZone('UTC'),
    organizer: { name: 'Club', platformIds: { ravepage: 'grp_x' } },
    lineup: [slot],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'unlisted' },
    flags: {},
    music: { genres: [] },
    links: {},
    extras: {},
    ...over,
  };
}

const ORG = { organizerType: 'group', organizerId: 'grp_x' };

beforeEach(() => {
  h.ext = createFake().ext;
  rec.calls.length = 0;
});

describe('planCreate', () => {
  it('emits draft/unlisted event + one slot + two B2B performers referencing the slot', () => {
    const { steps } = planCreate(core(), { organizer: ORG, publish: false });
    const create = steps[0];
    expect(create?.routeId).toBe('events.create');
    const ev = create?.request as Record<string, unknown>;
    expect(ev.status).toBe('draft');
    expect(ev.visibility).toBe('unlisted');
    expect(ev.is_public).toBe(false);
    expect(ev.organizer_type).toBe('group');
    expect(ev.organizer_id).toBe('grp_x');

    const slot = steps.find((s) => s.id === 'slot0');
    expect(slot?.routeId).toBe('slots.create');
    expect((slot?.request as Record<string, unknown>).eventId).toEqual({ $ref: 'create.id' });

    const perfs = steps.filter((s) => s.kind === 'performer');
    expect(perfs).toHaveLength(2); // B2B
    for (const p of perfs) {
      const body = (p.request as { body: Record<string, unknown> }).body;
      expect(body.slot_id).toEqual({ $ref: 'slot0.id' });
    }
    expect(steps.some((s) => s.kind === 'genres')).toBe(false);
  });

  it('publish=true -> scheduled/public/is_public true', () => {
    const { steps } = planCreate(core(), { organizer: ORG, publish: true });
    const ev = steps[0]?.request as Record<string, unknown>;
    expect(ev.status).toBe('scheduled');
    expect(ev.visibility).toBe('public');
    expect(ev.is_public).toBe(true);
  });

  it('resolves genre names to ids via the vocab', () => {
    const { steps } = planCreate(core({ music: { genres: ['Techno', 'Unknown'] } }), {
      organizer: ORG,
      publish: false,
      genreVocab: { techno: 'gen_1' },
    });
    const g = steps.find((s) => s.kind === 'genres');
    expect(g?.routeId).toBe('genres.assign');
    expect((g?.request as { body: { ids: string[] } }).body.ids).toEqual(['gen_1']);
  });
});

describe('slotUpdateShape', () => {
  it('only sets *Set flags for changed fields (camelCase)', () => {
    const shape = slotUpdateShape(
      { slot_number: 1, slot_title: 'New', starts_at: START, ends_at: END },
      { slot_number: 1, slot_title: 'Old', starts_at: START, ends_at: END, id: 'slt_a' },
    );
    expect(shape).toEqual({ slotTitle: 'New', slotTitleSet: true });
  });
});

describe('planUpdate', () => {
  it('patches a kept slot, deletes a removed slot, replaces performers', () => {
    const current = core({
      extras: {
        ravepage: {
          slots: [
            { id: 'slt_1', slot_number: 1, slot_title: 'Old', starts_at: START, ends_at: END },
            { id: 'slt_2', slot_number: 2, slot_title: 'Gone', starts_at: START },
          ],
          performers: [{ id: 'ep_1', slot_id: 'slt_1', stage_name: 'A' }],
        },
      },
    });
    const next = core({ lineup: [{ order: 1, start: START, end: END, title: 'New', performers: [dj('A')], dancers: [] }] });
    const { steps } = planUpdate(next, { id: 'evt_1', current });

    expect(steps[0]?.routeId).toBe('events.update');
    const patch = steps.find((s) => s.routeId === 'slots.update');
    expect((patch?.request as { slotId: string }).slotId).toBe('slt_1');
    expect((patch?.request as { body: Record<string, unknown> }).body).toMatchObject({ slotTitle: 'New', slotTitleSet: true });
    expect(steps.some((s) => s.routeId === 'slots.delete')).toBe(true);
    expect(steps.some((s) => s.routeId === 'performers.delete')).toBe(true);
    expect(steps.some((s) => s.routeId === 'performers.add')).toBe(true);
  });

  it('event PUT body carries no organizer mutation', () => {
    const { steps } = planUpdate(core(), { id: 'evt_1', current: core() });
    const body = (steps[0]?.request as { body: Record<string, unknown> }).body;
    expect(body).not.toHaveProperty('organizer_type');
    expect(body).not.toHaveProperty('organizer_id');
  });
});

describe('planDelete / planPoster', () => {
  it('planDelete emits one delete step', () => {
    const { steps } = planDelete('evt_9');
    expect(steps).toHaveLength(1);
    expect(steps[0]?.routeId).toBe('events.delete');
    expect((steps[0]?.request as { eventId: string }).eventId).toBe('evt_9');
  });

  it('planPoster(null) -> delete; platform ref -> assign; bytes -> approximated', () => {
    expect(planPoster('evt_9', null).steps[0]?.routeId).toBe('poster.delete');
    const assign = planPoster('evt_9', { kind: 'platform', platform: 'ravepage', ref: 'upl_1' });
    expect(assign.steps[0]?.routeId).toBe('poster.assign');
    expect((assign.steps[0]?.request as { body: { media_upload_id: string } }).body.media_upload_id).toBe('upl_1');
    const bytes = planPoster('evt_9', { kind: 'bytes', bytes: new Uint8Array(1), mimeType: 'image/png' });
    expect(bytes.steps).toHaveLength(0);
    expect(bytes.report.approximated).toHaveLength(1);
  });
});

describe('executeStep / runPlan', () => {
  it('dispatches create by routeId and returns the result', async () => {
    const step: PlannedStep = { id: 'create', platform: 'ravepage', kind: 'create', routeId: 'events.create', request: { title: 'X' }, previewLabel: '' };
    expect(await executeStep(step)).toEqual({ id: 'evt_new' });
    expect(rec.calls).toContainEqual({ name: 'createEvent', arg: { requestBody: { title: 'X' } } });
  });

  it('runPlan resolves $ref placeholders across steps', async () => {
    const { steps } = planCreate(core(), { organizer: ORG, publish: false });
    const results = await runPlan(steps);
    expect(results['create']).toEqual({ id: 'evt_new' });
    const slotCall = rec.calls.find((c) => c.name === 'createSlot');
    expect(slotCall?.arg.eventId).toBe('evt_new'); // {$ref:'create.id'} resolved
    const perfCall = rec.calls.find((c) => c.name === 'addPerformer');
    expect((perfCall?.arg.requestBody as { slot_id: string }).slot_id).toBe('slt_new'); // {$ref:'slot0.id'} resolved
  });

  it('unknown routeId -> UNSUPPORTED', async () => {
    const step: PlannedStep = { id: 'x', platform: 'ravepage', kind: 'create', routeId: 'bogus', request: {}, previewLabel: '' };
    await expect(executeStep(step)).rejects.toMatchObject({ code: 'UNSUPPORTED' });
  });
});
