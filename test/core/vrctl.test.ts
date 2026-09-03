import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import type { EventCore } from '../../src/core/schema';
import { buildVrctlCreateFields, buildVrctlDetailFields } from '../../src/core/mapping/to-vrctl';
import type { VrctlField } from '../../src/core/mapping/to-vrctl';
import { fromVrctl } from '../../src/core/mapping/from-vrctl';
import type { VrctlDetailForm } from '../../src/core/mapping/vrctl-types';
import { computeLoss, VRCTL_CAPS } from '../../src/core/capabilities';

const FIX = join(process.cwd(), 'test', 'fixtures');
const fx = (p: string): unknown => JSON.parse(readFileSync(join(FIX, p), 'utf8'));
const BERLIN = asIanaZone('Europe/Berlin');

function oneSlotCore(overrides: Partial<EventCore> = {}): EventCore {
  return {
    title: "what's poppin",
    description: 'desc',
    start: asIsoUtc('2026-09-03T20:00:00Z'),
    end: asIsoUtc('2026-09-03T21:00:00Z'),
    doorsOpen: asIsoUtc('2026-09-03T19:30:00Z'),
    zone: BERLIN,
    organizer: { name: 'Example Club', platformIds: { vrctl: '9001' } },
    lineup: [
      {
        order: 1,
        start: asIsoUtc('2026-09-03T20:00:00Z'),
        end: asIsoUtc('2026-09-03T21:00:00Z'),
        performers: [{ name: 'Example DJ', aliases: [{ platform: 'vrctl', id: '300001', name: 'Example DJ' }] }],
        dancers: [],
        publicNote: 'pub',
        privateNote: 'priv',
      },
    ],
    hosts: [],
    dancers: [],
    poster: { kind: 'url', url: 'https://example.invalid/poster.png' },
    visibility: { publish: false, audience: 'followers' },
    flags: { nsfw: true, platforms: ['windows'], openDecks: true, ageGated: true, photosensitivity: 'severe', avatarRestrictions: true },
    music: { genres: [] },
    links: { announcement: 'https://example.invalid/post' },
    extras: {},
    ...overrides,
  };
}

const norm = (k: string): string => k.replace(/^slots\[\d+\]/, 'slots[*]');
const nameSet = (fields: VrctlField[]): Set<string> => new Set(fields.map(([k]) => norm(k)));
const strVal = (fields: VrctlField[], key: string): string | undefined => {
  const hit = fields.find(([k]) => k === key);
  return hit && typeof hit[1] === 'string' ? hit[1] : undefined;
};

describe('buildVrctlCreateFields', () => {
  it('emits create fields in order', () => {
    const out = buildVrctlCreateFields(oneSlotCore(), { organizerId: '9001' });
    expect(out).toEqual([
      ['name', "what's poppin"],
      ['start', '2026-09-03T22:00'],
      ['timezone', 'Europe/Berlin'],
      ['slots', '1'],
      ['duration', '60'],
      ['_submit', 'Save'],
      ['_do', 'form-form-submit'],
    ]);
  });
});

describe('buildVrctlDetailFields', () => {
  const form = fx('vrctl/detail-form.json') as VrctlDetailForm;
  const captured = [
    'organizers[]', 'name', 'description', 'instanceOpenMinutesBeforeStart', 'start', 'timezone', 'url',
    'howToJoin', 'showSlots', 'slots[*][duration]', 'slots[*][flag]', 'slots[*][performers][]',
    'slots[*][publicNote]', 'slots[*][privateNote]', 'flags[1]', 'flags[2][]', 'flags[3]', 'flags[4]',
    'flags[5]', 'flags[6]', 'posterType', '_submit', '_do',
  ];

  it('field set is a superset of the captured field names', () => {
    const names = nameSet(buildVrctlDetailFields(oneSlotCore(), form, { publish: true, organizerId: '9001' }));
    for (const c of captured) expect(names.has(c)).toBe(true);
  });

  it('published present only when publish:true', () => {
    const yes = nameSet(buildVrctlDetailFields(oneSlotCore(), form, { publish: true }));
    const no = nameSet(buildVrctlDetailFields(oneSlotCore(), form, { publish: false }));
    expect(yes.has('published')).toBe(true);
    expect(no.has('published')).toBe(false);
  });

  it('maps flags to scraped option ids', () => {
    const out = buildVrctlDetailFields(oneSlotCore(), form, { publish: false });
    expect(strVal(out, 'flags[1]')).toBe('1'); // NSFW
    expect(strVal(out, 'flags[2][]')).toBe('2'); // Windows
    expect(strVal(out, 'flags[3]')).toBe('on'); // open decks
    expect(strVal(out, 'flags[5]')).toBe('10'); // severe photosensitivity
    expect(strVal(out, 'posterType')).toBe('url');
    expect(strVal(out, 'instanceOpenMinutesBeforeStart')).toBe('30');
  });

  it('NSFW undefined -> flags[1] omitted + computeLoss required', () => {
    const core = oneSlotCore({ flags: {} });
    const out = buildVrctlDetailFields(core, form, { publish: false });
    expect(nameSet(out).has('flags[1]')).toBe(false);
    const loss = computeLoss(core, VRCTL_CAPS);
    expect(loss.required).toEqual([{ path: 'flags.nsfw', reason: 'vrctl requires flags.nsfw' }]);
  });

  it('contiguous durations; gap -> approximated', () => {
    const twoSlotForm: VrctlDetailForm = {
      actionUrl: '',
      doValue: 'form-form-submit',
      organizerOptions: [],
      selectedOrganizerIds: ['9001'],
      timezoneOptions: [],
      howToJoinOptions: [],
      flagCategories: {},
      selectedFlags: {},
      slots: [
        { id: '11', performers: [] },
        { id: '22', performers: [] },
      ],
      current: {},
    };
    const core = oneSlotCore({
      flags: { nsfw: false },
      lineup: [
        { order: 1, start: asIsoUtc('2026-09-03T20:00:00Z'), end: asIsoUtc('2026-09-03T20:30:00Z'), performers: [], dancers: [] },
        { order: 2, start: asIsoUtc('2026-09-03T21:00:00Z'), end: asIsoUtc('2026-09-03T22:00:00Z'), performers: [], dancers: [] },
      ],
    });
    const out = buildVrctlDetailFields(core, twoSlotForm, { publish: false });
    const durations = out.filter(([k]) => /\[duration\]$/.test(k)).map(([, v]) => v);
    expect(durations).toEqual(['30', '60']); // own lengths, laid contiguously (gap dropped)
    const loss = computeLoss(core, VRCTL_CAPS);
    expect(loss.approximated.some((e) => e.path === 'lineup')).toBe(true);
  });
});

describe('fromVrctl', () => {
  it('parses a detail form back to EventCore', () => {
    const form = fx('vrctl/detail-form.json') as VrctlDetailForm;
    const core = fromVrctl(form, { organizerName: 'Example Club' });
    expect(core.title).toBe("what's poppin");
    expect(core.start).toBe('2026-09-03T20:00:00Z');
    expect(core.lineup).toHaveLength(1);
    expect(core.lineup[0]?.performers[0]?.name).toBe('Example DJ');
    expect(core.flags.nsfw).toBe(true);
    expect(core.flags.platforms).toEqual(['windows']);
    expect(core.flags.avatarRestrictions).toBe(false); // "No avatar restriction"
  });
});
