import { describe, expect, it } from 'vitest';
import { asIanaZone, asIsoUtc } from '../../../src/core/time';
import type { EventCore } from '../../../src/core/schema';
import { resolveRefs, renderPreview, type PlannedStep } from '../../../src/core/planner';
import { planCreate, planDelete, planPoster, planUpdate } from '../../../src/adapters/vrcpop/planner';
import { ownEventRef, ownGroupRef } from '../../../src/adapters/vrcpop/types';

const GRP = ownGroupRef('grp_00000000-0000-4000-8000-000000000001', 'Example Club');
const EVT = ownEventRef(100001);
const BERLIN = asIanaZone('Europe/Berlin');

function core(): EventCore {
  const start = asIsoUtc('2026-09-03T20:00:00Z');
  return {
    title: "what's poppin",
    description: '',
    start,
    end: asIsoUtc('2026-09-03T21:00:00Z'),
    zone: BERLIN,
    organizer: { name: 'Example Club', vrchatGroupId: GRP.id, platformIds: { vrcpop: GRP.id } },
    lineup: [{ order: 1, start, end: asIsoUtc('2026-09-03T21:00:00Z'), performers: [{ name: 'Example DJ', aliases: [{ platform: 'vrcpop', name: 'Example DJ' }] }], dancers: [] }],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'public' },
    flags: {},
    music: { genres: [], sceneType: 'rave' },
    links: {},
    extras: {},
  };
}

function body(step: PlannedStep): Record<string, unknown> {
  return (step.request as { body: Record<string, unknown> }).body;
}

describe('planCreate', () => {
  it('is a single create step with status:draft by default', () => {
    const steps = planCreate(core(), { group: GRP, publish: false });
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({ id: 'create', routeId: 'create', kind: 'create' });
    expect(body(steps[0]!)).toMatchObject({ action: 'create', status: 'draft', group_id: GRP.id, event_name: "what's poppin" });
  });

  it('publish:true sets status:published and warns in the label', () => {
    const steps = planCreate(core(), { group: GRP, publish: true });
    expect(body(steps[0]!).status).toBe('published');
    expect(steps[0]!.previewLabel).toContain('PUBLISH');
  });

  it('with a poster expands to create -> flyerUpload -> reread -> update(flyer_url,version)', () => {
    const steps = planCreate(core(), { group: GRP, publish: false, poster: { filename: 'f.png', mime: 'image/png' } });
    expect(steps.map((s) => s.id)).toEqual(['create', 'flyerUpload', 'reread', 'update']);
    const resolved = resolveRefs(steps[3]!, {
      create: { event_id: 100009, event: ownEventRef(100009) as unknown as never },
      flyerUpload: { flyer_url: '/flyers/x.png' },
      reread: { version: 7 },
    });
    const b = (resolved.request as { body: Record<string, unknown> }).body;
    expect(b.event_id).toBe(100009);
    expect(b.version).toBe(7);
    expect(b.flyer_url).toBe('/flyers/x.png');
  });
});

describe('planUpdate', () => {
  it('re-reads version first, then updates with a version ref', () => {
    const steps = planUpdate(core(), { group: GRP, event: EVT, publish: false });
    expect(steps.map((s) => s.id)).toEqual(['reread', 'update']);
    expect(steps[0]).toMatchObject({ routeId: 'editPage' });
    const raw = (steps[1]!.request as { body: Record<string, unknown> }).body;
    expect(raw.version).toEqual({ $ref: 'reread.version' });
    expect(raw.event_id).toBe(EVT.id);
    // preview humanizes the ref rather than leaking a placeholder object
    expect(renderPreview(steps[1]!)).toContain('<new version>');
  });
});

describe('planDelete / planPoster', () => {
  it('planDelete is a single delete with {event_id}', () => {
    const steps = planDelete(EVT);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({ routeId: 'delete' });
    expect(body(steps[0]!)).toEqual({ event_id: 100001 });
  });

  it('planPoster remove is a single DELETE upload-flyer step', () => {
    const steps = planPoster(core(), { group: GRP, event: EVT, publish: false, poster: { remove: true } });
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({ routeId: 'flyerRemove', kind: 'poster' });
  });

  it('planPoster set reuses the update flow with a flyer upload', () => {
    const steps = planPoster(core(), { group: GRP, event: EVT, publish: false, poster: { filename: 'f.png', mime: 'image/png' } });
    expect(steps.map((s) => s.id)).toEqual(['reread', 'flyerUpload', 'update']);
  });
});
