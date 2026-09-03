// DST-safe local<->UTC via Intl only (no libs). Instants are IsoUtc, zones IanaZone.
import type { IsoUtc, IanaZone } from './schema';
import { BridgeError } from './errors';

const DAY_MS = 86_400_000;

// Brand a validated ISO-UTC string. Cast at boundary: format is asserted first.
export function asIsoUtc(s: string): IsoUtc {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(s)) {
    throw new BridgeError('VALIDATION', `not ISO-UTC: ${s}`);
  }
  return s as IsoUtc;
}

export function isValidZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

// Brand a validated IANA zone. Cast at boundary: zone is asserted via Intl first.
export function asIanaZone(zone: string): IanaZone {
  if (!isValidZone(zone)) throw new BridgeError('VALIDATION', `invalid zone: ${zone}`);
  return zone as IanaZone;
}

interface WallParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

// Wall-clock parts of a UTC instant as observed in `zone`.
function zonedParts(utcMs: number, zone: string): WallParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  let year = 0;
  let month = 1;
  let day = 1;
  let hour = 0;
  let minute = 0;
  let second = 0;
  for (const p of parts) {
    switch (p.type) {
      case 'year':
        year = Number(p.value);
        break;
      case 'month':
        month = Number(p.value);
        break;
      case 'day':
        day = Number(p.value);
        break;
      case 'hour':
        hour = Number(p.value) % 24; // h23 can emit 24 at midnight in some ICU builds
        break;
      case 'minute':
        minute = Number(p.value);
        break;
      case 'second':
        second = Number(p.value);
        break;
      default:
        break;
    }
  }
  return { year, month, day, hour, minute, second };
}

// The same wall-clock reinterpreted as if it were UTC (ms since epoch).
function wallAsUtcMs(utcMs: number, zone: string): number {
  const p = zonedParts(utcMs, zone);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
}

// Offset (ms) that `zone` is ahead of UTC at the given instant.
function zoneOffsetMs(utcMs: number, zone: string): number {
  return wallAsUtcMs(utcMs, zone) - utcMs;
}

function msToIsoUtc(ms: number): IsoUtc {
  // Drop millis: platforms use second precision; keeps round-trips stable.
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z') as IsoUtc;
}

function parseDate(date: string): [number, number, number] {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) throw new BridgeError('VALIDATION', `bad date: ${date}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function parseTime(time: string): [number, number] {
  const m = /^(\d{2}):(\d{2})$/.exec(time);
  if (!m) throw new BridgeError('VALIDATION', `bad time: ${time}`);
  return [Number(m[1]), Number(m[2])];
}

// 'YYYY-MM-DD' + 'HH:MM' in `zone` -> UTC instant.
// Nonexistent local times (spring-forward gap) resolve FORWARD (post-transition
// offset applied, i.e. the wall time is shifted past the gap). Ambiguous local
// times (fall-back) resolve to the FIRST occurrence (the earlier instant).
export function zonedLocalToUtc(date: string, time: string, zone: IanaZone | string): IsoUtc {
  if (!isValidZone(zone)) throw new BridgeError('VALIDATION', `invalid zone: ${zone}`);
  const [y, mo, d] = parseDate(date);
  const [h, mi] = parseTime(time);
  const asUtc = Date.UTC(y, mo - 1, d, h, mi, 0);
  // Probe the two DST offsets bracketing the target (transitions are >1 day apart).
  const offBefore = zoneOffsetMs(asUtc - DAY_MS, zone);
  const offAfter = zoneOffsetMs(asUtc + DAY_MS, zone);
  const candBefore = asUtc - offBefore;
  const candAfter = asUtc - offAfter;
  const beforeValid = wallAsUtcMs(candBefore, zone) === asUtc;
  const afterValid = wallAsUtcMs(candAfter, zone) === asUtc;
  let utcMs: number;
  if (beforeValid && afterValid) {
    utcMs = Math.min(candBefore, candAfter); // ambiguous -> first occurrence
  } else if (beforeValid) {
    utcMs = candBefore;
  } else if (afterValid) {
    utcMs = candAfter;
  } else {
    // Gap: no instant maps to this wall time. Apply the smaller offset so the
    // wall time reads forward (past the gap) rather than backward.
    utcMs = asUtc - Math.min(offBefore, offAfter);
  }
  return msToIsoUtc(utcMs);
}

export interface ZonedParts {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  offsetMinutes: number;
}

export function utcToZonedParts(iso: IsoUtc | string, zone: IanaZone | string): ZonedParts {
  if (!isValidZone(zone)) throw new BridgeError('VALIDATION', `invalid zone: ${zone}`);
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) throw new BridgeError('VALIDATION', `bad instant: ${iso}`);
  const p = zonedParts(ms, zone);
  const pad = (n: number, w = 2): string => String(n).padStart(w, '0');
  return {
    date: `${pad(p.year, 4)}-${pad(p.month)}-${pad(p.day)}`,
    time: `${pad(p.hour)}:${pad(p.minute)}`,
    offsetMinutes: zoneOffsetMs(ms, zone) / 60_000,
  };
}

// 'YYYY-MM-DDTHH:MM' for an <input type=datetime-local> in `zone`.
export function toDatetimeLocal(iso: IsoUtc | string, zone: IanaZone | string): string {
  const p = utcToZonedParts(iso, zone);
  return `${p.date}T${p.time}`;
}

export function addMinutes(iso: IsoUtc | string, minutes: number): IsoUtc {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) throw new BridgeError('VALIDATION', `bad instant: ${iso}`);
  return msToIsoUtc(ms + minutes * 60_000);
}

// Whole minutes from `a` to `b` (b - a).
export function diffMinutes(a: IsoUtc | string, b: IsoUtc | string): number {
  const am = Date.parse(a);
  const bm = Date.parse(b);
  if (Number.isNaN(am) || Number.isNaN(bm)) throw new BridgeError('VALIDATION', 'bad instant');
  return Math.round((bm - am) / 60_000);
}
