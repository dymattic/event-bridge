import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import { zonedLocalToUtc } from '../../src/core/time';
import type { EventCore } from '../../src/core/schema';
import { toVrcpopPayload } from '../../src/core/mapping/to-vrcpop';
import type { VrcpopEventPayload } from '../../src/core/mapping/to-vrcpop';
import { fromVrcpop } from '../../src/core/mapping/from-vrcpop';
import type { VrcpopDataEvent, VrcpopLineupBody } from '../../src/core/mapping/from-vrcpop';

const FIX = join(process.cwd(), 'test', 'fixtures');
const fx = (p: string): unknown => JSON.parse(readFileSync(join(FIX, p), 'utf8'));

const GRP = 'grp_00000000-0000-4000-8000-000000000001';
const BERLIN = asIanaZone('Europe/Berlin');

function sampleCore(): EventCore {
  return {
    title: "what's poppin",
    description: '',
    start: asIsoUtc('2026-09-03T20:00:00Z'), // 22:00 Berlin
    end: asIsoUtc('2026-09-03T21:00:00Z'), // 23:00 Berlin
    zone: BERLIN,
    organizer: { name: 'Example Club', vrchatGroupId: GRP, platformIds: { vrcpop: GRP } },
    lineup: [
      {
        order: 1,
        start: asIsoUtc('2026-09-03T20:00:00Z'),
        end: asIsoUtc('2026-09-03T21:00:00Z'),
        performers: [{ name: 'Example DJ', aliases: [{ platform: 'vrcpop', name: 'Example DJ' }] }],
        dancers: [],
      },
    ],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'public' },
    flags: {},
    music: { genres: [], sceneType: 'rave' },
    links: {},
    extras: {},
  };
}

describe('toVrcpopPayload', () => {
  const golden = fx('vrcpop/golden-create.json') as VrcpopEventPayload;

  it('reproduces the captured create payload with status:draft by default', () => {
    const out = toVrcpopPayload(sampleCore(), { groupId: GRP, ownerTimezone: BERLIN, publish: false });
    expect(out).toEqual(golden);
  });

  it('sets status:published under publish:true', () => {
    const out = toVrcpopPayload(sampleCore(), { groupId: GRP, ownerTimezone: BERLIN, publish: true });
    expect(out).toEqual({ ...golden, status: 'published' });
  });

  it('update adds event_id + version', () => {
    const out = toVrcpopPayload(sampleCore(), { groupId: GRP, ownerTimezone: BERLIN, publish: false, eventId: 100001, version: 2 });
    expect(out).toEqual({ ...golden, action: 'update', event_id: 100001, version: 2 });
  });
});

// Mimic the server storing a create payload back as an edit-page data-event.
function simulateServer(payload: VrcpopEventPayload, zone: string): VrcpopDataEvent {
  return {
    id: payload.event_id ?? 100001,
    group_id: payload.group_id,
    event_name: payload.event_name,
    event_description: payload.event_description,
    owner_timezone: zone,
    start_timestamp_utc: zonedLocalToUtc(payload.event_date, payload.start_time, zone),
    end_timestamp_utc: payload.end_time ? zonedLocalToUtc(payload.event_date, payload.end_time, zone) : null,
    status: payload.status,
    version: payload.version ?? 1,
    scene_type: payload.scene_type,
    sets: payload.sets.map((s) => ({
      set_order: s.set_order,
      start_timestamp_utc: s.start_time ? zonedLocalToUtc(payload.event_date, s.start_time, zone) : null,
      end_timestamp_utc: s.end_time ? zonedLocalToUtc(payload.event_date, s.end_time, zone) : null,
      dj_name: s.performers[0]?.name ?? null,
      performers: s.performers.map((p) => ({ performer_name: p.name, performer_profile_id: p.profile_id })),
    })),
  };
}

describe('fromVrcpop(toVrcpopPayload(core)) preserves title/start/slots', () => {
  it('round-trips', () => {
    const core = sampleCore();
    const payload = toVrcpopPayload(core, { groupId: GRP, ownerTimezone: BERLIN, publish: false });
    const back = fromVrcpop(simulateServer(payload, BERLIN));
    expect(back.title).toBe(core.title);
    expect(back.start).toBe(core.start);
    expect(back.lineup).toHaveLength(1);
    expect(back.lineup[0]?.start).toBe(core.lineup[0]?.start);
    expect(back.lineup[0]?.end).toBe(core.lineup[0]?.end);
    expect(back.lineup[0]?.performers[0]?.name).toBe('Example DJ');
  });
});

describe('fromVrcpop on sanitized fixtures', () => {
  it('parses data-event, prefers *_timestamp_utc, keeps version in extras', () => {
    const data = fx('vrcpop/data-event.json') as VrcpopDataEvent;
    const core = fromVrcpop(data);
    expect(core.title).toBe("what's poppin");
    expect(core.start).toBe('2026-09-03T20:00:00Z');
    expect(core.end).toBe('2026-09-03T21:00:00Z');
    expect(core.zone).toBe('Europe/Berlin');
    expect(core.music.sceneType).toBe('rave');
    expect(core.lineup[0]?.performers[0]?.name).toBe('Example DJ');
    expect(core.extras.vrcpop).toMatchObject({ version: 2, status: 'published' });
  });

  it('prefers the richer lineup body when supplied', () => {
    const data = fx('vrcpop/data-event.json') as VrcpopDataEvent;
    const lineup = fx('vrcpop/lineup.json') as VrcpopLineupBody;
    const core = fromVrcpop(data, lineup);
    expect(core.organizer.name).toBe('Example Club');
    expect(core.lineup[0]?.genre).toBe('Open Genre');
  });
});
