import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import type { EventCore } from '../../src/core/schema';
import { toRavepage } from '../../src/core/mapping/to-ravepage';
import { fromRavepage } from '../../src/core/mapping/from-ravepage';
import type { EventOut } from '../../src/adapters/ravepage/api-client/models/EventOut';
import type { EventSlotOut } from '../../src/adapters/ravepage/api-client/models/EventSlotOut';
import type { EventPerformerOut } from '../../src/adapters/ravepage/api-client/models/EventPerformerOut';

const FIX = join(process.cwd(), 'test', 'fixtures');
const fx = (p: string): unknown => JSON.parse(readFileSync(join(FIX, p), 'utf8'));

function b2bCore(): EventCore {
  return {
    title: 'B2B night',
    start: asIsoUtc('2026-09-03T20:00:00Z'),
    end: asIsoUtc('2026-09-03T21:00:00Z'),
    zone: asIanaZone('Europe/Berlin'),
    organizer: { name: '', platformIds: { ravepage: 'grp_00000000-0000-4000-8000-000000000001' } },
    lineup: [
      {
        order: 1,
        start: asIsoUtc('2026-09-03T20:00:00Z'),
        end: asIsoUtc('2026-09-03T21:00:00Z'),
        performers: [
          { name: 'DJ A', aliases: [] },
          { name: 'DJ B', aliases: [] },
        ],
        dancers: [],
        genre: 'DnB',
      },
    ],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'unlisted' },
    flags: { openDecks: true, platforms: ['windows'] },
    music: { genres: ['DnB'], energy: 'High Energy' },
    links: { world: 'https://example.invalid/world' },
    extras: {},
  };
}

describe('toRavepage', () => {
  it('draft/unlisted defaults; UTC ISO times; B2B = 2 performers on 1 slot', () => {
    const build = toRavepage(b2bCore(), { organizerType: 'group', organizerId: 'grp_x', publish: false, genreVocab: { dnb: 'gen_1' } });
    expect(build.event.status).toBe('draft');
    expect(build.event.visibility).toBe('unlisted');
    expect(build.event.is_public).toBe(false);
    expect(build.event.starts_at).toBe('2026-09-03T20:00:00Z');
    expect(build.event.ends_at).toBe('2026-09-03T21:00:00Z');
    expect(build.event.timezone).toBe('Europe/Berlin');
    expect(build.event.open_decks).toBe(true);
    expect(build.event.platforms).toEqual(['windows']);
    expect(build.slots).toHaveLength(1);
    expect(build.slots[0]?.slot_number).toBe(1);
    expect(build.slots[0]?.starts_at).toBe('2026-09-03T20:00:00Z');
    expect(build.performers).toHaveLength(2);
    expect(build.performers.every((p) => p.slotIndex === 0)).toBe(true);
    expect(build.performers.map((p) => p.performer.performer_name)).toEqual(['DJ A', 'DJ B']);
    expect(build.genreIds).toEqual(['gen_1']);
  });

  it('publish -> scheduled/public/is_public', () => {
    const build = toRavepage(b2bCore(), { organizerType: 'group', organizerId: 'grp_x', publish: true });
    expect(build.event.status).toBe('scheduled');
    expect(build.event.visibility).toBe('public');
    expect(build.event.is_public).toBe(true);
  });
});

describe('fromRavepage', () => {
  it('parses generated event/slot/performer models', () => {
    const event = fx('ravepage/event-out.json') as EventOut;
    const slots = fx('ravepage/slots.json') as EventSlotOut[];
    const performers = fx('ravepage/performers.json') as EventPerformerOut[];
    const core = fromRavepage(event, slots, performers);
    expect(core.title).toBe("what's poppin");
    expect(core.start).toBe('2026-09-03T20:00:00Z');
    expect(core.zone).toBe('Europe/Berlin');
    expect(core.visibility).toEqual({ publish: false, audience: 'unlisted' });
    expect(core.lineup).toHaveLength(1);
    expect(core.lineup[0]?.performers.map((p) => p.name)).toEqual(['Example DJ', 'Example DJ Two']); // B2B
  });

  it('round-trips core -> toRavepage -> fromRavepage', () => {
    const core = b2bCore();
    const build = toRavepage(core, { organizerType: 'group', organizerId: 'grp_x', publish: false });
    const slotId = 'slt_1';
    const event: EventOut = {
      id: 'evt_1',
      title: build.event.title,
      description: build.event.description,
      organizer_type: build.event.organizer_type,
      organizer_id: build.event.organizer_id,
      starts_at: build.event.starts_at,
      ends_at: build.event.ends_at,
      timezone: build.event.timezone,
      status: build.event.status,
      visibility: build.event.visibility,
      is_public: build.event.is_public,
      open_decks: build.event.open_decks,
      platforms: build.event.platforms,
    };
    const slots: EventSlotOut[] = build.slots.map((s, i) => ({
      id: slotId,
      slot_number: s.slot_number,
      slot_title: s.slot_title,
      starts_at: s.starts_at,
      ends_at: s.ends_at,
    }));
    const performers: EventPerformerOut[] = build.performers.map((p, i) => ({
      id: `ep_${i}`,
      slot_id: slotId,
      stage_name: p.performer.performer_name,
      billing_order: p.performer.billing_order,
    }));
    const back = fromRavepage(event, slots, performers);
    expect(back.title).toBe(core.title);
    expect(back.start).toBe(core.start);
    expect(back.lineup).toHaveLength(1);
    expect(back.lineup[0]?.performers.map((p) => p.name)).toEqual(['DJ A', 'DJ B']);
  });
});
