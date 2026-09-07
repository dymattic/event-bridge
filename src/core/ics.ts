// RFC 5545 iCalendar builder for gig groups. PURE. One VEVENT per GigGroup;
// deterministic for a fixed `now`. Adapters/views pass grouped gigs + a mode.
import type { Gig, GigGroup } from './gigs';

export type IcsMode = 'set' | 'event'; // DTSTART/DTEND = user's set times (fallback event) | whole event

export interface IcsOptions {
  mode: IcsMode;
  calName?: string;
  prodId?: string;
  now: Date;
  platformNames: Record<Gig['platform'], string>;
}

const CRLF = '\r\n';
const DEFAULT_PRODID = '-//event-bridge//EN';

// Escape TEXT values: backslash first, then ; , and newlines (RFC 5545 §3.3.11).
export function icsEscape(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

// Fold at 75 OCTETS (UTF-8 aware; never split a multibyte char). Continuation
// lines begin with a single space (reserving 1 of the 75 octets).
export function icsFold(line: string): string {
  const enc = new TextEncoder();
  const pieces: string[] = [];
  let cur = '';
  let bytes = 0;
  let max = 75; // first line
  for (const ch of Array.from(line)) {
    const b = enc.encode(ch).length;
    if (bytes + b > max) {
      pieces.push(cur);
      cur = ch;
      bytes = b;
      max = 74; // continuation: leading space counts toward 75
    } else {
      cur += ch;
      bytes += b;
    }
  }
  pieces.push(cur);
  return pieces.join(`${CRLF} `);
}

// ISO -> UTC basic form, e.g. 20260907T140000Z.
export function icsUtc(iso: string): string {
  const d = new Date(iso);
  const p = (n: number, w = 2): string => String(n).padStart(w, '0');
  return (
    `${p(d.getUTCFullYear(), 4)}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`
  );
}

interface VEvent {
  dtStartMs: number;
  lines: string[];
}

function buildVEvent(group: GigGroup, opts: IcsOptions): VEvent | null {
  const first = group.gigs[0];
  if (!first) return null;

  let dtStart = group.start;
  let dtEnd = group.end;
  let usedSet = false;
  if (opts.mode === 'set' && group.setStart) {
    dtStart = group.setStart;
    dtEnd = group.setEnd;
    usedSet = true;
  }

  const summary = usedSet ? `${group.title} (set)` : group.title;
  const descLines = group.gigs.map((g) => `${opts.platformNames[g.platform]}: ${g.eventUrl}`);
  descLines.push(`Matched: ${first.matchedName}`);

  const lines: string[] = [
    'BEGIN:VEVENT',
    `UID:${first.platform}-${first.eventId}@event-bridge`,
    `DTSTAMP:${icsUtc(opts.now.toISOString())}`,
    `DTSTART:${icsUtc(dtStart)}`,
  ];
  if (dtEnd !== undefined) lines.push(`DTEND:${icsUtc(dtEnd)}`);
  lines.push(`SUMMARY:${icsEscape(summary)}`);
  if (group.clubName) lines.push(`LOCATION:${icsEscape(group.clubName)}`);
  lines.push(`URL:${first.eventUrl}`);
  lines.push(`DESCRIPTION:${icsEscape(descLines.join('\n'))}`);
  lines.push('END:VEVENT');

  return { dtStartMs: Date.parse(dtStart), lines };
}

export function buildIcs(groups: readonly GigGroup[], opts: IcsOptions): string {
  const head: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${opts.prodId ?? DEFAULT_PRODID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  if (opts.calName) head.push(`X-WR-CALNAME:${icsEscape(opts.calName)}`);

  const events = groups
    .map((g) => buildVEvent(g, opts))
    .filter((e): e is VEvent => e !== null)
    .sort((a, b) => a.dtStartMs - b.dtStartMs);

  const logical = [...head, ...events.flatMap((e) => e.lines), 'END:VCALENDAR'];
  return logical.map(icsFold).join(CRLF) + CRLF;
}
