// Pure filter/sort logic for the events table + the row shape the UI renders.
// No DOM, no adapters -> unit-tested standalone.
import type { Platform } from '../../shared/agent-protocol';

// One own-event row aggregated across platforms. Only resolved, human-readable
// fields; raw ids stay in id/clubId (never the primary label).
export interface EventRow {
  platform: Platform;
  id: string;
  title: string;
  start?: string; // IsoUtc (adapter listing); may be absent on some listings
  status?: string;
  visibility?: string;
  clubId: string;
  clubName: string;
  zone?: string; // IANA zone, only when a read has resolved it
}

export type TimeFilter = 'upcoming' | 'past' | 'all';

export interface EventFilterState {
  platforms: Platform[]; // empty = all
  clubIds: string[]; // empty = all
  statuses: string[]; // empty = all
  time: TimeFilter;
  from?: string; // ISO date (inclusive) — optional explicit range
  to?: string; // ISO date (inclusive)
  q: string; // search over title + club name
  missing?: boolean; // logical view: rows missing a cell on a present platform
}

export const DEFAULT_FILTERS: EventFilterState = {
  platforms: [],
  clubIds: [],
  statuses: [],
  time: 'upcoming',
  q: '',
};

function startMs(row: EventRow): number | null {
  if (!row.start) return null;
  const ms = Date.parse(row.start);
  return Number.isFinite(ms) ? ms : null;
}

function matchesTime(row: EventRow, time: TimeFilter, now: number): boolean {
  if (time === 'all') return true;
  const ms = startMs(row);
  if (ms === null) return time === 'upcoming'; // undated -> treated as upcoming
  return time === 'upcoming' ? ms >= now : ms < now;
}

// Single source of truth for "counts as upcoming" (Overview card + #/events agree).
// Upcoming by time AND not explicitly a past-status row (a platform may mark a row
// past even when its listing date is unparseable/approximate).
export function isUpcoming(row: EventRow, now: number = Date.now()): boolean {
  return matchesTime(row, 'upcoming', now) && row.status !== 'past';
}

// Statuses that mean "scheduled/active" — a platform keeps these on an event even
// months after it happened (rave.page leaves `scheduled` on past events), so we
// show "ended" once the instant has passed instead of a misleading live status.
// A 'draft' is deliberately excluded: a past draft never happened, so it stays
// "draft" rather than reading as "ended".
const ACTIVE_STATUSES = new Set(['scheduled', 'live', 'published', 'promoted', 'public', 'active']);

// Status to DISPLAY for a row/event: "ended" when its end (or start, when no end)
// is before now and its raw status still reads as scheduled/active; otherwise the
// raw status unchanged. Purely cosmetic — isUpcoming/filtering are unaffected.
export function displayStatus(
  row: { start?: string; end?: string; status?: string },
  now: number = Date.now(),
): string | undefined {
  const status = row.status;
  if (status && ACTIVE_STATUSES.has(status.toLowerCase())) {
    const ref = row.end ?? row.start;
    const ms = ref ? Date.parse(ref) : NaN;
    if (Number.isFinite(ms) && ms < now) return 'ended';
  }
  return status;
}

// Whether a row is in scope for the current time filter. Past events are out of
// scope by default (time=upcoming): the matcher's suggestions and the sync pass
// use this so they ignore past rows until the user opts into past/all.
export function inTimeScope(row: EventRow, time: TimeFilter, now: number = Date.now()): boolean {
  if (time === 'all') return true;
  if (time === 'upcoming') return isUpcoming(row, now);
  return !isUpcoming(row, now); // past
}

function matchesRange(row: EventRow, from?: string, to?: string): boolean {
  const ms = startMs(row);
  if (from) {
    const f = Date.parse(from);
    if (Number.isFinite(f) && (ms === null || ms < f)) return false;
  }
  if (to) {
    const t = Date.parse(to);
    // inclusive end-of-day
    if (Number.isFinite(t) && (ms === null || ms > t + 86_400_000 - 1)) return false;
  }
  return true;
}

export function filterEvents(rows: EventRow[], f: EventFilterState, now: number = Date.now()): EventRow[] {
  const q = f.q.trim().toLowerCase();
  return rows.filter((r) => {
    if (f.platforms.length && !f.platforms.includes(r.platform)) return false;
    if (f.clubIds.length && !f.clubIds.includes(r.clubId)) return false;
    if (f.statuses.length && !f.statuses.includes(r.status ?? '')) return false;
    if (!matchesTime(r, f.time, now)) return false;
    if (!matchesRange(r, f.from, f.to)) return false;
    if (q) {
      const hay = `${r.title} ${r.clubName}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// Upcoming -> start ascending (soonest first); past/all -> start descending
// (most recent first). Undated rows sink to the end.
export function sortEvents(rows: EventRow[], time: TimeFilter): EventRow[] {
  const asc = time === 'upcoming';
  return [...rows].sort((a, b) => {
    const am = startMs(a);
    const bm = startMs(b);
    if (am === null && bm === null) return a.title.localeCompare(b.title);
    if (am === null) return 1;
    if (bm === null) return -1;
    return asc ? am - bm : bm - am;
  });
}

export function filterAndSort(rows: EventRow[], f: EventFilterState, now: number = Date.now()): EventRow[] {
  return sortEvents(filterEvents(rows, f, now), f.time);
}

// Distinct status values present in the rows (for the status filter options).
export function distinctStatuses(rows: EventRow[]): string[] {
  const set = new Set<string>();
  for (const r of rows) if (r.status) set.add(r.status);
  return [...set].sort();
}

// ---- URL (hash query) sync so filtered links are shareable ----

const PLATFORMS: readonly Platform[] = ['vrctl', 'vrcpop', 'ravepage'];
function isPlatform(v: string): v is Platform {
  return (PLATFORMS as readonly string[]).includes(v);
}
function splitCsv(v: string | null): string[] {
  return v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [];
}
function isTime(v: string | null): v is TimeFilter {
  return v === 'upcoming' || v === 'past' || v === 'all';
}

export function filtersToQuery(f: EventFilterState): string {
  const p = new URLSearchParams();
  if (f.platforms.length) p.set('platform', f.platforms.join(','));
  if (f.clubIds.length) p.set('club', f.clubIds.join(','));
  if (f.statuses.length) p.set('status', f.statuses.join(','));
  if (f.time !== 'upcoming') p.set('time', f.time);
  if (f.from) p.set('from', f.from);
  if (f.to) p.set('to', f.to);
  if (f.missing) p.set('missing', '1');
  const q = f.q.trim();
  if (q) p.set('q', q);
  return p.toString();
}

export function queryToFilters(query: string): EventFilterState {
  const p = new URLSearchParams(query);
  const time = p.get('time');
  return {
    platforms: splitCsv(p.get('platform')).filter(isPlatform),
    clubIds: splitCsv(p.get('club')),
    statuses: splitCsv(p.get('status')),
    time: isTime(time) ? time : 'upcoming',
    from: p.get('from') ?? undefined,
    to: p.get('to') ?? undefined,
    q: p.get('q') ?? '',
    missing: p.get('missing') === '1' ? true : undefined,
  };
}
