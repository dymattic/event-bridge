// Logical-event grouping + "probably the same event" matcher. PURE (no runtime/
// adapters/webext) so node tests load it. Linked rows (EventLink) collapse into
// one LogicalEvent with a cell per platform; unlinked rows on different platforms
// under the same club anchor become Suggestions the user can one-click Link.
import type { Platform } from '../../shared/agent-protocol';
import { PLATFORM_ORDER } from './platform-meta';
import { isUpcoming, type EventFilterState, type EventRow } from './event-filters';

// ---- title normalization + similarity ----

// lowercase, strip an optional test prefix, drop punctuation/emoji, collapse ws.
export function normalizeTitle(title: string, testPrefix?: string): string {
  let t = title.toLowerCase();
  const pfx = testPrefix?.trim().toLowerCase();
  if (pfx) t = t.split(pfx).join(' ');
  t = t.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  return t.replace(/\s+/g, ' ').trim();
}

function tokens(title: string): Set<string> {
  const n = normalizeTitle(title);
  return new Set(n ? n.split(' ') : []);
}

// Token-set Dice coefficient in [0,1].
export function titleSimilarity(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  return (2 * inter) / (ta.size + tb.size);
}

// ---- logical events ----

export interface LinkRef {
  platform: Platform;
  id: string;
}
// Structural subset of runtime EventLink (kept local to stay pure).
export interface MatchLink {
  anchorId: string;
  refs: LinkRef[];
}

export interface LogicalEvent {
  key: string;
  title: string;
  start?: string;
  clubAnchorId: string;
  clubName: string;
  cells: Partial<Record<Platform, EventRow>>;
  linkId?: string; // = EventLink.anchorId when grouped by a link
  staleRefs: number; // link refs with no matching row (ignored, but counted)
}

export interface Suggestion {
  key: string; // sorted `platform:id` refs joined by '|' (used for dismissal)
  rows: EventRow[];
  score: number;
  strong: boolean;
}

export interface GroupInput {
  rows: EventRow[];
  links: MatchLink[];
  anchorOf: (platform: Platform, clubId: string) => string;
  dismissed: string[];
  now?: number;
}

export interface GroupResult {
  logical: LogicalEvent[];
  suggestions: Suggestion[];
}

const DAY_MS = 24 * 60 * 60_000;
const HALF_HOUR_MS = 30 * 60_000;
const SIM_MIN = 0.6;
const SIM_STRONG = 0.9;

function rowKey(r: EventRow): string {
  return `${r.platform}:${r.id}`;
}

function startMs(start?: string): number | null {
  if (!start) return null;
  const ms = Date.parse(start);
  return Number.isFinite(ms) ? ms : null;
}

// Fill cells from the ordered candidates; first row per platform wins.
function cellsFrom(rows: EventRow[]): Partial<Record<Platform, EventRow>> {
  const cells: Partial<Record<Platform, EventRow>> = {};
  for (const r of rows) if (!cells[r.platform]) cells[r.platform] = r;
  return cells;
}

function firstCell(cells: Partial<Record<Platform, EventRow>>): EventRow {
  for (const p of PLATFORM_ORDER) {
    const c = cells[p];
    if (c) return c;
  }
  throw new Error('logical event with no cells');
}

function earliestStart(cells: Partial<Record<Platform, EventRow>>): string | undefined {
  let best: { ms: number; start: string } | undefined;
  for (const p of PLATFORM_ORDER) {
    const c = cells[p];
    const ms = startMs(c?.start);
    if (c?.start && ms !== null && (!best || ms < best.ms)) best = { ms, start: c.start };
  }
  return best?.start;
}

function makeLogical(
  cells: Partial<Record<Platform, EventRow>>,
  anchorOf: GroupInput['anchorOf'],
  linkId?: string,
  staleRefs = 0,
): LogicalEvent {
  const lead = firstCell(cells);
  const key = PLATFORM_ORDER.flatMap((p) => {
    const c = cells[p];
    return c ? [rowKey(c)] : [];
  }).join('|');
  return {
    key,
    title: lead.title,
    start: earliestStart(cells),
    clubAnchorId: anchorOf(lead.platform, lead.clubId),
    clubName: lead.clubName,
    cells,
    linkId,
    staleRefs,
  };
}

interface Pair {
  a: EventRow;
  b: EventRow;
  score: number;
  strong: boolean;
}

export function groupLogicalEvents(input: GroupInput): GroupResult {
  const { rows, links, anchorOf, dismissed } = input;
  const byRef = new Map<string, EventRow>();
  for (const r of rows) byRef.set(rowKey(r), r);

  const linked = new Set<string>();
  const logical: LogicalEvent[] = [];

  // 1. Linked rows -> one logical event each.
  for (const l of links) {
    const found: EventRow[] = [];
    let stale = 0;
    for (const ref of l.refs) {
      const r = byRef.get(`${ref.platform}:${ref.id}`);
      if (r) {
        found.push(r);
        linked.add(rowKey(r));
      } else {
        stale += 1;
      }
    }
    if (found.length === 0) continue;
    logical.push(makeLogical(cellsFrom(found), anchorOf, l.anchorId, stale));
  }

  // 2. Remaining rows -> singletons.
  const singles = rows.filter((r) => !linked.has(rowKey(r)));
  for (const r of singles) logical.push(makeLogical(cellsFrom([r]), anchorOf));

  // 3. Suggestions over singletons (cross-platform, same anchor).
  const dismissedSet = new Set(dismissed);
  const pairs: Pair[] = [];
  for (let i = 0; i < singles.length; i++) {
    for (let j = i + 1; j < singles.length; j++) {
      const a = singles[i]!;
      const b = singles[j]!;
      if (a.platform === b.platform) continue;
      if (anchorOf(a.platform, a.clubId) !== anchorOf(b.platform, b.clubId)) continue;
      const sim = titleSimilarity(a.title, b.title);
      if (sim < SIM_MIN) continue;
      const ma = startMs(a.start);
      const mb = startMs(b.start);
      const bothTimed = ma !== null && mb !== null;
      const delta = bothTimed ? Math.abs(ma - mb) : Infinity;
      const timeOk = bothTimed && delta <= DAY_MS;
      const simFallback = sim >= SIM_STRONG && !bothTimed;
      if (!timeOk && !simFallback) continue;
      const strong = bothTimed && delta <= HALF_HOUR_MS;
      const score = sim + (strong ? 0.5 : 0) + (bothTimed ? (1 - Math.min(delta, DAY_MS) / DAY_MS) * 0.1 : 0);
      pairs.push({ a, b, score, strong });
    }
  }
  pairs.sort((x, y) => y.score - x.score);

  const used = new Set<string>();
  const suggestions: Suggestion[] = [];
  for (const pair of pairs) {
    if (used.has(rowKey(pair.a)) || used.has(rowKey(pair.b))) continue;
    const group = [pair.a, pair.b];
    const platforms = new Set<Platform>([pair.a.platform, pair.b.platform]);
    let strong = pair.strong;
    // Extend to a third platform via the highest-scoring compatible pair.
    for (const ext of pairs) {
      let candidate: EventRow | undefined;
      if (group.includes(ext.a) && !platforms.has(ext.b.platform)) candidate = ext.b;
      else if (group.includes(ext.b) && !platforms.has(ext.a.platform)) candidate = ext.a;
      if (!candidate || used.has(rowKey(candidate))) continue;
      group.push(candidate);
      platforms.add(candidate.platform);
      strong = strong && ext.strong;
    }
    const key = group.map(rowKey).sort().join('|');
    if (dismissedSet.has(key)) continue;
    for (const r of group) used.add(rowKey(r));
    const ordered = [...group].sort((x, y) => PLATFORM_ORDER.indexOf(x.platform) - PLATFORM_ORDER.indexOf(y.platform));
    suggestions.push({ key, rows: ordered, score: pair.score, strong });
  }

  return { logical, suggestions };
}

// ---- filter + sort (reuses EventFilterState; +missing) ----

function cellList(le: LogicalEvent): EventRow[] {
  return PLATFORM_ORDER.flatMap((p) => {
    const c = le.cells[p];
    return c ? [c] : [];
  });
}

function haystack(le: LogicalEvent): string {
  const parts = [le.title, le.clubName];
  for (const c of cellList(le)) parts.push(c.title, c.clubName);
  return parts.join(' ').toLowerCase();
}

function allPast(le: LogicalEvent): boolean {
  const cells = cellList(le);
  return cells.length > 0 && cells.every((c) => c.status === 'past');
}

function timeMatches(le: LogicalEvent, f: EventFilterState, now: number): boolean {
  if (f.time === 'all') return true;
  const lead = firstCell(le.cells);
  const rep: EventRow = { ...lead, start: le.start, status: allPast(le) ? 'past' : lead.status };
  if (f.time === 'upcoming') return isUpcoming(rep, now);
  const ms = startMs(le.start);
  if (ms === null) return false; // past filter drops undated
  return ms < now;
}

function rangeMatches(le: LogicalEvent, from?: string, to?: string): boolean {
  const ms = startMs(le.start);
  if (from) {
    const f = Date.parse(from);
    if (Number.isFinite(f) && (ms === null || ms < f)) return false;
  }
  if (to) {
    const t = Date.parse(to);
    if (Number.isFinite(t) && (ms === null || ms > t + DAY_MS - 1)) return false;
  }
  return true;
}

export function filterLogical(
  logical: LogicalEvent[],
  f: EventFilterState,
  present: Platform[],
  now: number = Date.now(),
): LogicalEvent[] {
  const q = f.q.trim().toLowerCase();
  const kept = logical.filter((le) => {
    const cells = cellList(le);
    if (f.platforms.length && !cells.some((c) => f.platforms.includes(c.platform))) return false;
    if (f.clubIds.length && !cells.some((c) => f.clubIds.includes(c.clubId))) return false;
    if (f.statuses.length && !cells.some((c) => f.statuses.includes(c.status ?? ''))) return false;
    if (!timeMatches(le, f, now)) return false;
    if (!rangeMatches(le, f.from, f.to)) return false;
    if (f.missing && cells.length >= present.length) return false;
    if (q && !haystack(le).includes(q)) return false;
    return true;
  });

  const asc = f.time === 'upcoming';
  return kept.sort((a, b) => {
    const am = startMs(a.start);
    const bm = startMs(b.start);
    if (am === null && bm === null) return a.title.localeCompare(b.title);
    if (am === null) return 1;
    if (bm === null) return -1;
    return asc ? am - bm : bm - am;
  });
}
