import { describe, expect, it } from 'vitest';
import {
  normalizeName,
  nameMatches,
  matchLineupNames,
  isUpcomingGig,
  dedupeGigs,
  sortGigs,
  groupGigs,
  fmtDurationMin,
  type Gig,
} from '../../src/core/gigs';
import { asIsoUtc, asIanaZone } from '../../src/core/time';
import type { EventCore, Slot, Performer } from '../../src/core/schema';

const iso = (s: string) => asIsoUtc(s);

const gig = (o: Partial<Gig>): Gig => ({
  platform: 'vrctl',
  eventId: 'e',
  title: 'T',
  eventUrl: 'https://example/e',
  start: iso('2026-09-10T20:00:00Z'),
  matchedName: 'Dy',
  status: 'confirmed',
  source: 'own-event',
  ...o,
});

const perf = (name: string): Performer => ({ name, aliases: [] });
const slot = (o: Partial<Slot> & { order: number; start: Slot['start'] }): Slot => ({
  performers: [],
  dancers: [],
  ...o,
});
const event = (o: Partial<EventCore>): EventCore => ({
  title: 'E',
  start: iso('2026-09-10T20:00:00Z'),
  zone: asIanaZone('UTC'),
  organizer: { name: 'O', platformIds: {} },
  lineup: [],
  hosts: [],
  dancers: [],
  visibility: { publish: true, audience: 'public' },
  flags: {},
  music: { genres: [] },
  links: {},
  extras: {},
  ...o,
});

describe('normalizeName', () => {
  it('lowercases, strips a leading "dj " token, drops punctuation', () => {
    expect(normalizeName('DJ Dy-Mattic ')).toBe('dymattic');
    expect(normalizeName('K3N')).toBe('k3n');
  });
  it('folds diacritics via NFKD', () => {
    expect(normalizeName('José')).toBe('jose');
    expect(normalizeName('  DJ  Múltiple Ñame!!')).toBe('multiplename');
  });
  it('only strips "dj" as a whole leading token', () => {
    expect(normalizeName('djembe')).toBe('djembe'); // not "dj "
    expect(normalizeName('DJ-Mattic')).toBe('djmattic'); // hyphen, no space
  });
  it('empty / punctuation-only -> empty', () => {
    expect(normalizeName('')).toBe('');
    expect(normalizeName('!!!')).toBe('');
    expect(normalizeName('   ')).toBe('');
  });
});

describe('nameMatches', () => {
  const names = ['Dy-Mattic', 'K3N'];
  it('returns the typed form of the first matching name', () => {
    expect(nameMatches('dj dymattic', names)).toBe('Dy-Mattic');
    expect(nameMatches('k 3 n', names)).toBe('K3N');
  });
  it('null when nothing matches or candidate normalizes empty', () => {
    expect(nameMatches('someone else', names)).toBeNull();
    expect(nameMatches('!!!', names)).toBeNull();
  });
  it('empty normalized names never match', () => {
    expect(nameMatches('anything', ['', '!!!'])).toBeNull();
  });
});

describe('matchLineupNames', () => {
  const core = event({
    lineup: [
      slot({ order: 1, start: iso('2026-09-10T20:00:00Z'), end: iso('2026-09-10T21:00:00Z'), performers: [perf('Someone')], vj: perf('The VJ') }),
      slot({ order: 2, start: iso('2026-09-10T21:00:00Z'), end: iso('2026-09-10T22:00:00Z'), performers: [perf('DJ Target')] }),
    ],
    hosts: [perf('Host Person')],
  });
  it('first slot match wins with that slot times (performer, dj-prefixed)', () => {
    expect(matchLineupNames(core, ['target'])).toEqual({
      matchedName: 'target',
      setStart: '2026-09-10T21:00:00Z',
      setEnd: '2026-09-10T22:00:00Z',
    });
  });
  it('matches a slot vj with the vj slot times', () => {
    expect(matchLineupNames(core, ['the vj'])).toEqual({
      matchedName: 'the vj',
      setStart: '2026-09-10T20:00:00Z',
      setEnd: '2026-09-10T21:00:00Z',
    });
  });
  it('matches a host with NO set times', () => {
    expect(matchLineupNames(core, ['host person'])).toEqual({ matchedName: 'host person' });
  });
  it('null when nothing matches', () => {
    expect(matchLineupNames(core, ['nobody'])).toBeNull();
  });
});

describe('isUpcomingGig', () => {
  const g = gig({ end: iso('2026-09-10T22:00:00Z') });
  const t = Date.parse('2026-09-10T22:00:00Z');
  it('boundary is inclusive (a running set still counts)', () => {
    expect(isUpcomingGig(g, t)).toBe(true);
    expect(isUpcomingGig(g, t + 1)).toBe(false);
  });
  it('prefers setEnd > end > setStart > start', () => {
    const s = gig({ start: iso('2026-01-01T00:00:00Z'), setStart: iso('2026-12-01T00:00:00Z') });
    expect(isUpcomingGig(s, Date.parse('2026-06-01T00:00:00Z'))).toBe(true); // setStart future
  });
});

describe('dedupeGigs', () => {
  it('per (platform,eventId) prefers setStart then booking>profile>own-event, then first seen', () => {
    const dupes: Gig[] = [
      gig({ platform: 'vrcpop', eventId: '9', source: 'own-event' }),
      gig({ platform: 'vrcpop', eventId: '9', source: 'booking', setStart: iso('2026-09-10T21:00:00Z') }),
      gig({ platform: 'vrcpop', eventId: '9', source: 'profile' }),
    ];
    const out = dedupeGigs(dupes);
    expect(out).toHaveLength(1);
    expect(out[0]!.source).toBe('booking');
    expect(out[0]!.setStart).toBe('2026-09-10T21:00:00Z');
  });
  it('keeps distinct keys in first-seen order', () => {
    const out = dedupeGigs([
      gig({ platform: 'ravepage', eventId: 'b' }),
      gig({ platform: 'vrctl', eventId: 'a' }),
      gig({ platform: 'ravepage', eventId: 'b' }),
    ]);
    expect(out.map((g) => `${g.platform}:${g.eventId}`)).toEqual(['ravepage:b', 'vrctl:a']);
  });
});

describe('sortGigs', () => {
  it('by (setStart ?? start) asc, then platform order, then title', () => {
    const out = sortGigs([
      gig({ platform: 'ravepage', eventId: '1', title: 'B', start: iso('2026-09-10T22:00:00Z') }),
      gig({ platform: 'vrctl', eventId: '2', title: 'A', start: iso('2026-09-10T20:00:00Z') }),
      gig({ platform: 'vrcpop', eventId: '3', title: 'A', start: iso('2026-09-10T20:00:00Z') }),
    ]);
    expect(out.map((g) => `${g.platform}:${g.title}`)).toEqual(['vrctl:A', 'vrcpop:A', 'ravepage:B']);
  });
  it('setStart overrides start for ordering', () => {
    const out = sortGigs([
      gig({ eventId: '1', start: iso('2026-09-10T20:00:00Z'), setStart: iso('2026-09-10T23:00:00Z') }),
      gig({ platform: 'vrcpop', eventId: '2', start: iso('2026-09-10T21:00:00Z') }),
    ]);
    expect(out.map((g) => g.eventId)).toEqual(['2', '1']);
  });
});

describe('groupGigs', () => {
  it('joins same-title different-platform within the window', () => {
    const groups = groupGigs([
      gig({ platform: 'vrctl', eventId: '1', title: 'Neon Rave', start: iso('2026-09-10T20:00:00Z'), setStart: iso('2026-09-10T21:00:00Z'), setEnd: iso('2026-09-10T22:00:00Z'), clubName: 'Club A' }),
      gig({ platform: 'vrcpop', eventId: '2', title: 'Neon Rave!', start: iso('2026-09-10T20:30:00Z'), clubName: 'Club A' }),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.gigs.map((g) => g.platform)).toEqual(['vrctl', 'vrcpop']);
    expect(groups[0]!.title).toBe('Neon Rave');
    expect(groups[0]!.start).toBe('2026-09-10T20:00:00Z');
    expect(groups[0]!.setStart).toBe('2026-09-10T21:00:00Z');
    expect(groups[0]!.key).toBe('neon rave|2026-09-10T21:00:00Z');
  });
  it('never joins two gigs from the SAME platform', () => {
    const groups = groupGigs([
      gig({ platform: 'vrctl', eventId: 'a', title: 'X', start: iso('2026-09-10T20:00:00Z') }),
      gig({ platform: 'vrctl', eventId: 'b', title: 'X', start: iso('2026-09-10T20:10:00Z') }),
    ]);
    expect(groups).toHaveLength(2);
  });
  it('joins close-club fuzzy titles (<=1h, Dice>=0.8)', () => {
    const groups = groupGigs([
      gig({ platform: 'vrctl', eventId: 'a', title: 'Summer Bass Night', start: iso('2026-09-10T20:00:00Z'), clubName: 'Bass Cave' }),
      gig({ platform: 'vrcpop', eventId: 'b', title: 'Summer Bass Nite', start: iso('2026-09-10T20:30:00Z'), clubName: 'Bass Cave' }),
    ]);
    expect(groups).toHaveLength(1);
  });
  it('keeps far-apart same-title events separate (>window)', () => {
    const groups = groupGigs([
      gig({ platform: 'vrctl', eventId: 'a', title: 'Recurring', start: iso('2026-09-10T20:00:00Z') }),
      gig({ platform: 'vrcpop', eventId: 'b', title: 'Recurring', start: iso('2026-09-11T20:00:00Z') }),
    ]);
    expect(groups).toHaveLength(2);
  });
  it('does not fuzzy-join a different club even with a close title', () => {
    const groups = groupGigs([
      gig({ platform: 'vrctl', eventId: 'a', title: 'Bass Night', start: iso('2026-09-10T20:00:00Z'), clubName: 'Cave' }),
      gig({ platform: 'vrcpop', eventId: 'b', title: 'Bass Nite', start: iso('2026-09-10T20:30:00Z'), clubName: 'Barn' }),
    ]);
    expect(groups).toHaveLength(2);
  });
  it('is deterministic and sorts groups by earliest (setStart ?? start)', () => {
    const input: Gig[] = [
      gig({ platform: 'ravepage', eventId: '3', title: 'Later', start: iso('2026-09-20T20:00:00Z') }),
      gig({ platform: 'vrctl', eventId: '1', title: 'Earlier', start: iso('2026-09-10T20:00:00Z') }),
    ];
    const a = groupGigs(input);
    const b = groupGigs([...input].reverse());
    expect(a.map((g) => g.title)).toEqual(['Earlier', 'Later']);
    expect(b.map((g) => g.title)).toEqual(a.map((g) => g.title));
  });
});

describe('fmtDurationMin', () => {
  it('formats hours and minutes', () => {
    expect(fmtDurationMin(90)).toBe('1h 30m');
    expect(fmtDurationMin(60)).toBe('1h');
    expect(fmtDurationMin(45)).toBe('45m');
    expect(fmtDurationMin(125)).toBe('2h 5m');
  });
  it('<=0 or non-finite -> empty', () => {
    expect(fmtDurationMin(0)).toBe('');
    expect(fmtDurationMin(-5)).toBe('');
    expect(fmtDurationMin(Number.NaN)).toBe('');
  });
});
