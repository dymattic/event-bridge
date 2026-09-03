import { describe, expect, it } from 'vitest';
import {
  addMinutes,
  asIanaZone,
  asIsoUtc,
  diffMinutes,
  isValidZone,
  toDatetimeLocal,
  utcToZonedParts,
  zonedLocalToUtc,
} from '../../src/core/time';
import { BridgeError } from '../../src/core/errors';

const BERLIN = 'Europe/Berlin';
const LA = 'America/Los_Angeles';
const TOKYO = 'Asia/Tokyo';

describe('zonedLocalToUtc — Europe/Berlin DST edges', () => {
  it('CET before spring-forward', () => {
    expect(zonedLocalToUtc('2026-03-29', '01:59', BERLIN)).toBe('2026-03-29T00:59:00Z');
  });
  it('CEST after spring-forward', () => {
    expect(zonedLocalToUtc('2026-03-29', '03:00', BERLIN)).toBe('2026-03-29T01:00:00Z');
  });
  it('nonexistent gap time resolves FORWARD', () => {
    const iso = zonedLocalToUtc('2026-03-29', '02:30', BERLIN);
    expect(iso).toBe('2026-03-29T01:30:00Z');
    // reads back as 03:30 local (shifted past the gap)
    expect(utcToZonedParts(iso, BERLIN).time).toBe('03:30');
  });
  it('ambiguous fall-back time resolves to FIRST occurrence', () => {
    const iso = zonedLocalToUtc('2026-10-25', '02:30', BERLIN);
    expect(iso).toBe('2026-10-25T00:30:00Z'); // CEST, the earlier instant
    expect(utcToZonedParts(iso, BERLIN)).toEqual({ date: '2026-10-25', time: '02:30', offsetMinutes: 120 });
  });
});

describe('zonedLocalToUtc — other zones', () => {
  it('America/Los_Angeles round-trips', () => {
    const iso = zonedLocalToUtc('2026-07-04', '23:15', LA);
    expect(toDatetimeLocal(iso, LA)).toBe('2026-07-04T23:15');
    expect(utcToZonedParts(iso, LA).offsetMinutes).toBe(-420); // PDT
  });
  it('LA spring gap resolves forward', () => {
    const iso = zonedLocalToUtc('2026-03-08', '02:30', LA);
    expect(utcToZonedParts(iso, LA).time).toBe('03:30');
  });
  it('Asia/Tokyo has no DST', () => {
    expect(zonedLocalToUtc('2026-09-03', '22:00', TOKYO)).toBe('2026-09-03T13:00:00Z');
    expect(utcToZonedParts(asIsoUtc('2026-09-03T13:00:00Z'), TOKYO).offsetMinutes).toBe(540);
  });
});

describe('formatting + helpers', () => {
  it('toDatetimeLocal formats YYYY-MM-DDTHH:MM', () => {
    expect(toDatetimeLocal(asIsoUtc('2026-09-03T20:00:00Z'), BERLIN)).toBe('2026-09-03T22:00');
  });
  it('addMinutes / diffMinutes', () => {
    const a = asIsoUtc('2026-09-03T20:00:00Z');
    const b = addMinutes(a, 90);
    expect(b).toBe('2026-09-03T21:30:00Z');
    expect(diffMinutes(a, b)).toBe(90);
  });
});

describe('zone validation', () => {
  it('isValidZone', () => {
    expect(isValidZone(BERLIN)).toBe(true);
    expect(isValidZone('Not/AZone')).toBe(false);
  });
  it('asIanaZone rejects invalid', () => {
    expect(() => asIanaZone('Not/AZone')).toThrow(BridgeError);
  });
  it('zonedLocalToUtc rejects invalid zone', () => {
    expect(() => zonedLocalToUtc('2026-09-03', '22:00', 'Not/AZone')).toThrow(BridgeError);
  });
  it('asIsoUtc rejects non-ISO', () => {
    expect(() => asIsoUtc('2026-09-03 20:00:00')).toThrow(BridgeError);
  });
});
