// Locale-aware date/time formatting via Intl (viewer's browser locale). Zone-
// aware when a platform zone is known; otherwise the viewer's local zone. No deps.
const DAY_MS = 86_400_000;

function parse(iso: string | undefined): number | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

function fmt(ms: number, opts: Intl.DateTimeFormatOptions, zone?: string): string {
  const withZone: Intl.DateTimeFormatOptions = zone ? { ...opts, timeZone: zone } : opts;
  try {
    return new Intl.DateTimeFormat(undefined, withZone).format(ms);
  } catch {
    return new Intl.DateTimeFormat(undefined, opts).format(ms); // invalid zone -> local
  }
}

const DATE: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
const TIME: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
const DATETIME: Intl.DateTimeFormatOptions = { ...DATE, ...TIME };

export function formatLocalDateTime(iso: string | undefined, zone?: string): string {
  const ms = parse(iso);
  return ms === null ? '' : fmt(ms, DATETIME, zone);
}

export function formatLocalDate(iso: string | undefined, zone?: string): string {
  const ms = parse(iso);
  return ms === null ? '' : fmt(ms, DATE, zone);
}

export function formatLocalTime(iso: string | undefined, zone?: string): string {
  const ms = parse(iso);
  return ms === null ? '' : fmt(ms, TIME, zone);
}

// Whole local-day index since epoch (for day-granularity relative wording).
function dayIndex(ms: number): number {
  const d = new Date(ms);
  return Math.floor((ms - d.getTimezoneOffset() * 60_000) / DAY_MS);
}

// "today" / "tomorrow" / "yesterday" / "in 3 days" / "3 days ago" (viewer locale).
export function formatRelativeDay(iso: string | undefined, now: number = Date.now()): string {
  const ms = parse(iso);
  if (ms === null) return '';
  const diff = dayIndex(ms) - dayIndex(now);
  try {
    return new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(diff, 'day');
  } catch {
    if (diff === 0) return 'today';
    return diff > 0 ? `in ${diff} days` : `${-diff} days ago`;
  }
}
