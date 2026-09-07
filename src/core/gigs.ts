// "My gigs": upcoming sets/appearances of the user across platforms, matched by
// DJ name against event lineups. PURE (schema + time only; NEVER imports ui) so
// node tests load it. Adapters build Gig[]; views consume the exports below.
import type { EventCore, IsoUtc, PlatformId } from './schema';

export type GigSource = 'profile' | 'own-event' | 'booking';
export type GigStatus = 'confirmed' | 'pending';

// One upcoming set/appearance of the user on ONE platform. Human-readable fields
// only; ids ride along for links/dedupe (never a primary label in the UI).
export interface Gig {
  platform: PlatformId;
  eventId: string;
  title: string;
  eventUrl: string; // PUBLIC event page URL (adapter fills it)
  clubName?: string;
  clubUrl?: string;
  start: IsoUtc; // event start (or set start when the event start is unknown)
  end?: IsoUtc; // event end
  setStart?: IsoUtc; // the user's slot, when known
  setEnd?: IsoUtc;
  matchedName: string; // the user-entered name that matched (as typed)
  status: GigStatus; // 'pending' only for unaccepted bookings
  source: GigSource;
}

// Same logical gig seen on several platforms.
export interface GigGroup {
  key: string; // stable: `${normalizedTitle}|${bucketStartIso}`
  title: string; // first gig's title
  start: IsoUtc; // earliest start
  end?: IsoUtc;
  setStart?: IsoUtc; // earliest known set start
  setEnd?: IsoUtc;
  clubName?: string;
  gigs: Gig[]; // one per platform, PLATFORM_ORDER vrctl, vrcpop, ravepage
}

const HOUR_MS = 3_600_000;
const DEFAULT_WINDOW_MS = 6 * HOUR_MS;

// Local platform order (kept here to stay ui-free). Matches platform-meta.
const PLATFORM_ORDER: readonly PlatformId[] = ['vrctl', 'vrcpop', 'ravepage'];
const PLATFORM_RANK: Record<PlatformId, number> = { vrctl: 0, vrcpop: 1, ravepage: 2 };
const SOURCE_RANK: Record<GigSource, number> = { booking: 0, profile: 1, 'own-event': 2 };

// lowercase, NFKD + strip combining marks, strip a leading "dj " token, drop
// every char that is not [a-z0-9], collapse. 'DJ Dy-Mattic ' -> 'dymattic'.
export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/^\s*dj\s+/, '')
    .replace(/[^a-z0-9]+/g, '');
}

// FIRST entry of `names` (as typed) whose normalizeName equals the candidate's,
// else null. Empty normalized names never match.
export function nameMatches(candidate: string, names: readonly string[]): string | null {
  const nc = normalizeName(candidate);
  if (!nc) return null;
  for (const n of names) if (normalizeName(n) === nc) return n;
  return null;
}

// Scan lineup in slot order (performers then vj); first match wins with that
// slot's set times. Hosts match with no set times. null when nothing matches.
export function matchLineupNames(
  core: EventCore,
  names: readonly string[],
): { matchedName: string; setStart?: IsoUtc; setEnd?: IsoUtc } | null {
  for (const slot of core.lineup) {
    for (const p of slot.performers) {
      const m = nameMatches(p.name, names);
      if (m !== null) return { matchedName: m, setStart: slot.start, setEnd: slot.end };
    }
    if (slot.vj) {
      const m = nameMatches(slot.vj.name, names);
      if (m !== null) return { matchedName: m, setStart: slot.start, setEnd: slot.end };
    }
  }
  for (const h of core.hosts) {
    const m = nameMatches(h.name, names);
    if (m !== null) return { matchedName: m };
  }
  return null;
}

function ms(iso: string): number {
  return Date.parse(iso);
}

// A running set still counts as upcoming.
export function isUpcomingGig(g: Gig, now: number): boolean {
  return ms(g.setEnd ?? g.end ?? g.setStart ?? g.start) >= now;
}

// True when `a` should replace `b` as the representative of a (platform,eventId).
function betterGig(a: Gig, b: Gig): boolean {
  const as = a.setStart ? 1 : 0;
  const bs = b.setStart ? 1 : 0;
  if (as !== bs) return as > bs;
  const ar = SOURCE_RANK[a.source];
  const br = SOURCE_RANK[b.source];
  if (ar !== br) return ar < br;
  return false; // tie -> keep first seen
}

// Per (platform,eventId) keep ONE: prefer setStart, then booking>profile>own-event,
// then first seen. Output in first-seen order of each key. Stable.
export function dedupeGigs(gigs: readonly Gig[]): Gig[] {
  const best = new Map<string, Gig>();
  const order: string[] = [];
  for (const g of gigs) {
    const key = `${g.platform}|${g.eventId}`;
    const cur = best.get(key);
    if (cur === undefined) {
      best.set(key, g);
      order.push(key);
    } else if (betterGig(g, cur)) {
      best.set(key, g);
    }
  }
  return order.map((k) => best.get(k)!);
}

// Locale-free string compare (brief: no Intl here).
function cmpStr(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

// by (setStart ?? start) asc, then platform order, then title.
export function sortGigs(gigs: readonly Gig[]): Gig[] {
  return [...gigs].sort((a, b) => {
    const d = ms(a.setStart ?? a.start) - ms(b.setStart ?? b.start);
    if (d !== 0) return d;
    const p = PLATFORM_RANK[a.platform] - PLATFORM_RANK[b.platform];
    if (p !== 0) return p;
    return cmpStr(a.title, b.title);
  });
}

// lowercase, NFKD fold, non-alphanumerics -> single space, collapse+trim.
function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Sørensen-Dice coefficient over character bigrams of two strings.
function diceBigrams(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const count = new Map<string, number>();
  for (let i = 0; i < a.length - 1; i++) {
    const bg = a.slice(i, i + 2);
    count.set(bg, (count.get(bg) ?? 0) + 1);
  }
  let inter = 0;
  let bTotal = 0;
  for (let i = 0; i < b.length - 1; i++) {
    bTotal++;
    const bg = b.slice(i, i + 2);
    const c = count.get(bg);
    if (c && c > 0) {
      inter++;
      count.set(bg, c - 1);
    }
  }
  const aTotal = a.length - 1;
  return (2 * inter) / (aTotal + bTotal);
}

function normClub(name: string | undefined): string {
  return name ? normalizeTitle(name) : '';
}

function sharesClub(a: Gig, b: Gig): boolean {
  const ca = normClub(a.clubName);
  return ca !== '' && ca === normClub(b.clubName);
}

// Pairwise join test (never same platform). start-based (not setStart).
function gigsJoin(a: Gig, b: Gig, windowMs: number): boolean {
  if (a.platform === b.platform) return false;
  const ta = normalizeTitle(a.title);
  const tb = normalizeTitle(b.title);
  const dt = Math.abs(ms(a.start) - ms(b.start));
  if (ta !== '' && ta === tb && dt <= windowMs) return true;
  if (sharesClub(a, b) && dt <= HOUR_MS && diceBigrams(ta, tb) >= 0.8) return true;
  return false;
}

function minIso(a: IsoUtc | undefined, b: IsoUtc | undefined): IsoUtc | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return ms(a) <= ms(b) ? a : b;
}

function maxIso(a: IsoUtc | undefined, b: IsoUtc | undefined): IsoUtc | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return ms(a) >= ms(b) ? a : b;
}

function hourBucketIso(iso: string): string {
  const floored = Math.floor(ms(iso) / HOUR_MS) * HOUR_MS;
  return new Date(floored).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function buildGroup(gigs: Gig[]): GigGroup {
  const ordered = [...gigs].sort((a, b) => PLATFORM_RANK[a.platform] - PLATFORM_RANK[b.platform]);
  const first = ordered[0]!;
  let start: IsoUtc = first.start;
  let end: IsoUtc | undefined;
  let setStart: IsoUtc | undefined;
  let setEnd: IsoUtc | undefined;
  let clubName: string | undefined;
  for (const g of ordered) {
    start = minIso(start, g.start) ?? start;
    end = maxIso(end, g.end);
    setStart = minIso(setStart, g.setStart);
    setEnd = maxIso(setEnd, g.setEnd);
    if (clubName === undefined && g.clubName) clubName = g.clubName;
  }
  const group: GigGroup = {
    key: `${normalizeTitle(first.title)}|${hourBucketIso(setStart ?? start)}`,
    title: first.title,
    start,
    gigs: ordered,
  };
  if (end !== undefined) group.end = end;
  if (setStart !== undefined) group.setStart = setStart;
  if (setEnd !== undefined) group.setEnd = setEnd;
  if (clubName !== undefined) group.clubName = clubName;
  return group;
}

// Cross-platform grouping (see interface doc). Greedy single-linkage over a
// deterministic seed order; a group holds at most one gig per platform.
export function groupGigs(gigs: readonly Gig[], opts?: { windowMs?: number }): GigGroup[] {
  const windowMs = opts?.windowMs ?? DEFAULT_WINDOW_MS;
  const seed = sortGigs(gigs);
  const groups: Gig[][] = [];
  for (const g of seed) {
    let placed = false;
    for (const members of groups) {
      if (members.some((m) => m.platform === g.platform)) continue;
      if (members.some((m) => gigsJoin(m, g, windowMs))) {
        members.push(g);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([g]);
  }
  return groups
    .map(buildGroup)
    .sort((a, b) => {
      const d = ms(a.setStart ?? a.start) - ms(b.setStart ?? b.start);
      if (d !== 0) return d;
      const t = cmpStr(a.title, b.title);
      if (t !== 0) return t;
      return cmpStr(a.key, b.key);
    });
}

// 90 -> '1h 30m', 60 -> '1h', 45 -> '45m', <=0 -> ''.
export function fmtDurationMin(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return '';
  const total = Math.round(minutes);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}
