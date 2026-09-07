import { describe, expect, it } from 'vitest';
import { buildIcs, icsEscape, icsFold, icsUtc, type IcsOptions } from '../../src/core/ics';
import { groupGigs, type Gig, type GigGroup } from '../../src/core/gigs';
import { asIsoUtc } from '../../src/core/time';

const iso = (s: string) => asIsoUtc(s);
const NOW = new Date('2026-09-01T00:00:00Z');
const PLATFORM_NAMES = { vrctl: 'vrc.tl', vrcpop: 'vrcpop.com', ravepage: 'rave.page' };
const opts = (o: Partial<IcsOptions>): IcsOptions => ({ mode: 'set', now: NOW, platformNames: PLATFORM_NAMES, ...o });

const gig = (o: Partial<Gig>): Gig => ({
  platform: 'vrctl',
  eventId: 'e',
  title: 'T',
  eventUrl: 'https://example/e',
  start: iso('2026-09-10T20:00:00Z'),
  matchedName: 'Dy-Mattic',
  status: 'confirmed',
  source: 'own-event',
  ...o,
});

describe('icsEscape', () => {
  it('escapes backslash, comma, semicolon and newlines (RFC 5545 §3.3.11)', () => {
    expect(icsEscape('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne');
    expect(icsEscape('crlf\r\nend')).toBe('crlf\\nend');
  });
});

describe('icsUtc', () => {
  it('formats basic UTC', () => {
    expect(icsUtc('2026-09-07T14:00:00Z')).toBe('20260907T140000Z');
  });
});

describe('icsFold', () => {
  it('folds at 75 octets, continuation = CRLF + single space, never splits a multibyte char', () => {
    const line = 'SUMMARY:' + 'x'.repeat(70) + '🎵tail';
    const folded = icsFold(line);
    const physical = folded.split('\r\n');
    expect(physical.length).toBe(2);
    expect(physical[1]!.startsWith(' ')).toBe(true);
    const enc = new TextEncoder();
    for (const p of physical) expect(enc.encode(p).length).toBeLessThanOrEqual(75);
    // reconstruct: strip the continuation's single leading space
    expect(physical[0]! + physical[1]!.slice(1)).toBe(line);
    // emoji intact (not split across the fold)
    expect(folded).toContain('🎵');
  });
  it('short lines are unchanged', () => {
    expect(icsFold('VERSION:2.0')).toBe('VERSION:2.0');
  });
});

const setGroups = groupGigs([
  gig({ platform: 'vrctl', eventId: '1', title: 'Neon Rave', eventUrl: 'https://vrc.tl/event/1', start: iso('2026-09-10T20:00:00Z'), setStart: iso('2026-09-10T21:00:00Z'), setEnd: iso('2026-09-10T22:00:00Z'), clubName: 'Club A' }),
  gig({ platform: 'vrcpop', eventId: '2', title: 'Neon Rave!', eventUrl: 'https://vrcpop.com/event/2', start: iso('2026-09-10T20:30:00Z'), clubName: 'Club A' }),
  gig({ platform: 'ravepage', eventId: '3', title: 'Different Party', eventUrl: 'https://x/3', start: iso('2026-09-20T20:00:00Z') }),
]);

describe('buildIcs — set mode golden (two groups)', () => {
  const ics = buildIcs(setGroups, opts({ mode: 'set' }));
  it('matches the golden string', () => {
    const expected =
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//event-bridge//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:vrctl-1@event-bridge',
        'DTSTAMP:20260901T000000Z',
        'DTSTART:20260910T210000Z',
        'DTEND:20260910T220000Z',
        'SUMMARY:Neon Rave (set)',
        'LOCATION:Club A',
        'URL:https://vrc.tl/event/1',
        'DESCRIPTION:vrc.tl: https://vrc.tl/event/1\\nvrcpop.com: https://vrcpop.com/',
        ' event/2\\nMatched: Dy-Mattic',
        'END:VEVENT',
        'BEGIN:VEVENT',
        'UID:ravepage-3@event-bridge',
        'DTSTAMP:20260901T000000Z',
        'DTSTART:20260920T200000Z',
        'SUMMARY:Different Party',
        'URL:https://x/3',
        'DESCRIPTION:rave.page: https://x/3\\nMatched: Dy-Mattic',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n') + '\r\n';
    expect(ics).toBe(expected);
  });
  it('uses CRLF everywhere (no bare LF or CR)', () => {
    for (const physical of ics.split('\r\n')) {
      expect(physical.includes('\n')).toBe(false);
      expect(physical.includes('\r')).toBe(false);
    }
  });
  it('sorts VEVENTs by DTSTART and carries the sha-free UID', () => {
    const uids = [...ics.matchAll(/UID:(.+)/g)].map((m) => m[1]);
    expect(uids).toEqual(['vrctl-1@event-bridge', 'ravepage-3@event-bridge']);
    const starts = [...ics.matchAll(/DTSTART:(.+)/g)].map((m) => m[1]);
    expect(starts).toEqual(['20260910T210000Z', '20260920T200000Z']);
  });
});

describe('buildIcs — event mode golden + escaping', () => {
  const group: GigGroup = {
    key: 'k',
    title: 'Rock, Paper; Back\\slash',
    start: iso('2026-09-10T20:00:00Z'),
    end: iso('2026-09-10T23:00:00Z'),
    clubName: 'Line1\nLine2',
    gigs: [gig({ platform: 'vrctl', eventId: '1', title: 'x', eventUrl: 'https://vrc.tl/event/1', matchedName: 'Dy, the DJ' })],
  };
  it('event mode uses whole-event times and escapes TEXT values', () => {
    const ics = buildIcs([group], opts({ mode: 'event' }));
    const expected =
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//event-bridge//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:vrctl-1@event-bridge',
        'DTSTAMP:20260901T000000Z',
        'DTSTART:20260910T200000Z',
        'DTEND:20260910T230000Z',
        'SUMMARY:Rock\\, Paper\\; Back\\\\slash',
        'LOCATION:Line1\\nLine2',
        'URL:https://vrc.tl/event/1',
        'DESCRIPTION:vrc.tl: https://vrc.tl/event/1\\nMatched: Dy\\, the DJ',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n') + '\r\n';
    expect(ics).toBe(expected);
  });
});

describe('buildIcs — options', () => {
  it('honors calName (X-WR-CALNAME) and a custom prodId', () => {
    const ics = buildIcs(setGroups, opts({ calName: 'My Gigs', prodId: '-//acme//EN' }));
    expect(ics).toContain('PRODID:-//acme//EN\r\n');
    expect(ics).toContain('X-WR-CALNAME:My Gigs\r\n');
  });
  it('omits X-WR-CALNAME when no calName', () => {
    expect(buildIcs(setGroups, opts({}))).not.toContain('X-WR-CALNAME');
  });
  it('set mode without set times falls back to event times, no (set) suffix', () => {
    const g: GigGroup = { key: 'k', title: 'No Set', start: iso('2026-09-10T20:00:00Z'), end: iso('2026-09-10T22:00:00Z'), gigs: [gig({ eventId: '9', eventUrl: 'https://x/9' })] };
    const ics = buildIcs([g], opts({ mode: 'set' }));
    expect(ics).toContain('SUMMARY:No Set\r\n');
    expect(ics).toContain('DTSTART:20260910T200000Z');
    expect(ics).not.toContain('(set)');
  });
});
