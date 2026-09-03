import { describe, expect, it } from 'vitest';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import type { EventCore } from '../../src/core/schema';
import { canonicalJson, sha256Hex } from '../../src/core/hash';
import { diffEvents } from '../../src/core/diff';
import { validateEvent } from '../../src/core/validate';

function baseCore(): EventCore {
  return {
    title: 'Night',
    start: asIsoUtc('2026-09-03T20:00:00Z'),
    end: asIsoUtc('2026-09-03T23:00:00Z'),
    zone: asIanaZone('Europe/Berlin'),
    organizer: { name: '', platformIds: {} },
    lineup: [
      {
        order: 1,
        start: asIsoUtc('2026-09-03T20:00:00Z'),
        end: asIsoUtc('2026-09-03T21:00:00Z'),
        performers: [{ name: 'A', aliases: [] }],
        dancers: [],
      },
    ],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'public' },
    flags: {},
    music: { genres: [] },
    links: {},
    extras: {},
  };
}

describe('canonicalJson', () => {
  it('sorts keys and drops undefined', () => {
    expect(canonicalJson({ b: 2, a: 1, c: undefined })).toBe('{"a":1,"b":2}');
    expect(canonicalJson([1, undefined, 3])).toBe('[1,null,3]');
  });
});

describe('sha256Hex', () => {
  it('matches the known digest of "abc"', async () => {
    expect(await sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});

describe('diffEvents', () => {
  it('reports dot-path changes incl. slot performer names', () => {
    const a = baseCore();
    const b = baseCore();
    b.title = 'Day';
    const slot0 = b.lineup[0];
    if (slot0?.performers[0]) slot0.performers[0].name = 'B';
    const changes = diffEvents(a, b);
    const byPath = new Map(changes.map((c) => [c.path, c]));
    expect(byPath.get('title')).toEqual({ path: 'title', from: 'Night', to: 'Day' });
    expect(byPath.has('lineup.0.performers.0.name')).toBe(true);
  });

  it('identical cores produce no changes', () => {
    expect(diffEvents(baseCore(), baseCore())).toEqual([]);
  });
});

describe('validateEvent', () => {
  it('passes a well-formed event', () => {
    expect(validateEvent(baseCore())).toEqual([]);
  });

  it('flags empty title, end<=start, bad zone, out-of-span slot, empty performer', () => {
    const c = baseCore();
    c.title = '  ';
    c.end = asIsoUtc('2026-09-03T19:00:00Z'); // before start
    c.zone = 'Not/AZone' as EventCore['zone'];
    const slot0 = c.lineup[0];
    if (slot0) {
      slot0.start = asIsoUtc('2026-09-03T19:30:00Z'); // before event start
      slot0.performers = [{ name: '', aliases: [] }];
    }
    const issues = validateEvent(c).map((i) => i.path);
    expect(issues).toEqual(expect.arrayContaining(['title', 'end', 'zone', 'lineup.0.start', 'lineup.0.performers.0.name']));
  });
});
