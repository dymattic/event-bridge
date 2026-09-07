// vrcpop HTML parsers. Run in the dashboard (extension page has DOMParser) and
// under happy-dom in unit tests — never in the agent. Each failure names the
// marker it looked for so drift is diagnosable (BridgeError PARSE).
//
// Markers relied on (report these; site drift breaks them loudly):
//   dashboard   <meta name="csrf-token">, .club-card, .club-name,
//               a[href*="/manage/club/grp_.../"]
//   events list window.MANAGE_DATA={groupId,groupName}, .event-card,
//               .event-card--draft[data-draft-id], [data-section], .event-card-info h4,
//               .event-card-meta span, a[href*="/events/<id>"]
//   edit page   #event-wizard-container[data-event|data-event-id|data-group-id|
//               data-club-scene-type|data-default-hosts], data-event.version
import { BridgeError } from '../../core/errors';
import type { EventCore } from '../../core/schema';
import type { OwnEvent } from '../types';
import { fromVrcpop, type VrcpopDataEvent } from '../../core/mapping/from-vrcpop';
import { ownEventRef, ownGroupRef, type VrcpopClub, type VrcpopEventRef, type VrcpopEventStatus } from './types';

function parse(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

function collapse(s: string | null | undefined): string {
  return (s ?? '').replace(/\s+/g, ' ').trim();
}

function collectScriptText(doc: Document): string {
  return Array.from(doc.querySelectorAll('script'), (s) => s.textContent ?? '').join('\n');
}

const GRP_IN_PATH = /\/manage\/club\/(grp_[0-9a-fA-F-]+)/;

// ---- CSRF meta (present on every manage page) ----

export function parseCsrf(html: string): string {
  const doc = parse(html);
  const meta = doc.querySelector('meta[name="csrf-token"]');
  const token = meta?.getAttribute('content');
  if (!token) throw new BridgeError('PARSE', 'csrf meta missing: <meta name="csrf-token">');
  return token;
}

// ---- /dashboard: Clubs I Manage ----

export interface DashboardParse {
  csrf: string;
  clubs: VrcpopClub[];
}

export function parseDashboard(html: string): DashboardParse {
  const doc = parse(html);
  const csrf = doc.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (!csrf) throw new BridgeError('PARSE', 'dashboard: csrf meta missing');
  const clubs: VrcpopClub[] = [];
  for (const card of Array.from(doc.querySelectorAll('.club-card'))) {
    const name = collapse(card.querySelector('.club-name')?.textContent);
    let groupId = '';
    for (const a of Array.from(card.querySelectorAll('a[href]'))) {
      const m = GRP_IN_PATH.exec(a.getAttribute('href') ?? '');
      if (m?.[1]) {
        groupId = m[1];
        break;
      }
    }
    if (!groupId || !name) continue; // skip malformed cards; keep the well-formed ones
    clubs.push({ groupId, name, ref: ownGroupRef(groupId, name) });
  }
  return { csrf, clubs };
}

// ---- /manage/club/<grp>/events ----

export interface EventsListParse {
  groupId?: string;
  groupName?: string;
  csrf?: string;
  events: VrcpopEventRef[];
}

function manageData(scriptText: string): { groupId?: string; groupName?: string } {
  const anchor = /window\.MANAGE_DATA\s*=\s*\{/.exec(scriptText);
  if (!anchor) return {};
  const rest = scriptText.slice(anchor.index);
  const gid = /groupId\s*:\s*"([^"]+)"/.exec(rest);
  const gname = /groupName\s*:\s*"([^"]*)"/.exec(rest);
  return { groupId: gid?.[1], groupName: gname?.[1] };
}

const ID_IN_EVENT_HREF = /\/events\/(\d+)(?:$|[/?#"'])/;
const ID_IN_ONCLICK = /(?:deleteEvent|copyEventLink|copyDiscordSchedule|openDuplicateModal)\(\s*(\d+)/;

function cardEventId(card: Element): number | null {
  for (const a of Array.from(card.querySelectorAll('a[href]'))) {
    const m = ID_IN_EVENT_HREF.exec(a.getAttribute('href') ?? '');
    if (m?.[1]) return Number(m[1]);
  }
  for (const el of Array.from(card.querySelectorAll('[onclick]'))) {
    const m = ID_IN_ONCLICK.exec(el.getAttribute('onclick') ?? '');
    if (m?.[1]) return Number(m[1]);
  }
  return null;
}

function sectionStatus(card: Element): VrcpopEventStatus {
  if (card.classList.contains('event-card--draft')) return 'draft';
  const section = card.closest('[data-section]')?.getAttribute('data-section');
  if (section === 'history') return 'past';
  return 'upcoming';
}

export function parseEventsList(html: string): EventsListParse {
  const doc = parse(html);
  const csrf = doc.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? undefined;
  const md = manageData(collectScriptText(doc));
  const cards = Array.from(doc.querySelectorAll('.event-card'));
  if (cards.length === 0 && !md.groupId) {
    throw new BridgeError('PARSE', 'events list: no .event-card and no window.MANAGE_DATA');
  }
  const events: VrcpopEventRef[] = [];
  for (const card of cards) {
    const status = sectionStatus(card);
    const draftAttr = card.getAttribute('data-draft-id');
    const id = draftAttr ? Number(draftAttr) : cardEventId(card);
    if (id == null || !Number.isFinite(id)) continue;
    const title = collapse(card.querySelector('.event-card-info h4')?.textContent) || collapse(card.querySelector('h4')?.textContent);
    const date = collapse(card.querySelector('.event-card-meta span')?.textContent);
    events.push({ id, title, date, status, ref: ownEventRef(id) });
  }
  return { groupId: md.groupId, groupName: md.groupName, csrf, events };
}

// vrcpop renders the card date in the OWNER's timezone (e.g.
// "Thu, Sep 3, 2026 at 10:00 PM"), so a browser-local parse is an APPROXIMATION
// — good enough for listing/sorting/upcoming counts; the exact instant comes from
// readEvent (start_timestamp_utc). Returns an ISO string, or undefined when the
// label doesn't parse. NEVER put the raw label into OwnEvent.start (Date.parse ->
// NaN there breaks the upcoming count).
export function parseVrcpopCardDate(label: string): string | undefined {
  const ms = Date.parse(label.replace(' at ', ' '));
  return Number.isFinite(ms) ? new Date(ms).toISOString() : undefined;
}

// Map a parsed listing ref to the shared OwnEvent. start is an ISO instant
// (approx) or undefined — never the human label.
export function eventToOwn(e: VrcpopEventRef): OwnEvent {
  return {
    id: String(e.id),
    title: e.title,
    start: parseVrcpopCardDate(e.date),
    status: e.status,
    visibility: e.status === 'draft' ? 'draft' : 'public',
  };
}

// ---- /manage/club/<grp>/events/<id>/edit ----

export interface EditPageParse {
  dataEvent: VrcpopDataEvent;
  core: EventCore;
  version: number;
  eventId: number;
  groupId: string;
  sceneType: string | null;
  sceneTypeSecondary: string | null;
  defaultHosts: unknown;
}

function jsonAttr(el: Element, name: string): unknown {
  const raw = el.getAttribute(name);
  if (raw == null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    throw new BridgeError('PARSE', `edit page: ${name} is not valid JSON`);
  }
}

// ---- performer profile (My gigs, public /u/<slug>) ----

const SLUG_RE = /^[a-z0-9-]{1,64}$/;
const ID_IN_HREF = /\/event\/(\d+)/;

// Own performer slugs from the dashboard: <a href="/manage/performer/<slug>">.
// Validated + deduped; the manage link asserts the user owns that profile.
export function parseOwnPerformerSlugs(dashboardHtml: string): string[] {
  const doc = parse(dashboardHtml);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const a of Array.from(doc.querySelectorAll('a[href^="/manage/performer/"]'))) {
    const slug = (a.getAttribute('href') ?? '').replace('/manage/performer/', '').replace(/[/?#].*$/, '');
    if (SLUG_RE.test(slug) && !seen.has(slug)) {
      seen.add(slug);
      out.push(slug);
    }
  }
  return out;
}

function clockMinutes(h: number, m: number, ap: string | undefined): number {
  let hh = h % 12;
  if (ap && /pm/i.test(ap)) hh += 12;
  return hh * 60 + m;
}

// Derive a slot END from a rendered clock range + a UTC start. "10:00 PM-11:00 PM
// (CDT)" + startIso -> start + (end_clock - start_clock), wrapping past midnight.
// Returns ISO-Z, or undefined when the range/start doesn't parse or is zero-length.
export function parseVrcpopTimeRange(text: string, startIso: string): string | undefined {
  const startMs = Date.parse(startIso);
  if (!Number.isFinite(startMs)) return undefined;
  const m = /(\d{1,2}):(\d{2})\s*(am|pm)?\s*[-–—]\s*(\d{1,2}):(\d{2})\s*(am|pm)?/i.exec(text);
  if (!m) return undefined;
  const a = clockMinutes(Number(m[1]), Number(m[2]), m[3]);
  const b = clockMinutes(Number(m[4]), Number(m[5]), m[6]);
  const durMin = (b - a + 1440) % 1440;
  if (durMin === 0) return undefined;
  return new Date(startMs + durMin * 60_000).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export interface ProfileSet {
  eventId: number;
  title: string;
  eventPath: string;
  clubName?: string;
  clubPath?: string;
  start: string;
  end?: string;
  fromHero: boolean;
}

function eventIdFromHref(href: string): number | null {
  const m = ID_IN_HREF.exec(href);
  return m?.[1] ? Number(m[1]) : null;
}

// Parse a performer profile page into upcoming ProfileSets: the "Upcoming sets"
// hero (always kept — the section only renders with a future set) plus every
// .dj-set-row (outside upcoming_nights RSVPs) whose end/start is >= now. Deduped
// by event id, hero winning. Entities decode via DOMParser textContent.
export function parsePerformerProfile(html: string, now: number): ProfileSet[] {
  const doc = parse(html);
  const byId = new Map<number, ProfileSet>();

  const hero = doc.querySelector('.dj-section--upcoming .dj-next-hero[data-utc]');
  if (hero) {
    const start = hero.getAttribute('data-utc') ?? '';
    const eventA = hero.querySelector('.dj-next-hero__event');
    const eventPath = eventA?.getAttribute('href') ?? '';
    const id = eventIdFromHref(eventPath);
    if (id != null && start) {
      const clubA = hero.querySelector('.dj-next-hero__club');
      const timeText = collapse(hero.querySelector('.dj-next-hero__time')?.textContent);
      const set: ProfileSet = { eventId: id, title: collapse(eventA?.textContent), eventPath, start, fromHero: true };
      const clubName = collapse(clubA?.textContent);
      const clubPath = clubA?.getAttribute('href') ?? '';
      if (clubName) set.clubName = clubName;
      if (clubPath) set.clubPath = clubPath;
      const end = parseVrcpopTimeRange(timeText, start);
      if (end) set.end = end;
      byId.set(id, set);
    }
  }

  for (const row of Array.from(doc.querySelectorAll('.dj-set-row'))) {
    if (row.closest('[data-section-id="upcoming_nights"]')) continue; // RSVPs, not sets
    const timeEl = row.querySelector('.dj-set-time');
    const dataStart = timeEl?.getAttribute('data-start') ?? '';
    const dataEnd = timeEl?.getAttribute('data-end') ?? '';
    const when = dataEnd || dataStart;
    if (!when) continue;
    const whenMs = Date.parse(when);
    if (!Number.isFinite(whenMs) || whenMs < now) continue; // past / unparseable
    const eventA = row.querySelector('.dj-set-event');
    const eventPath = eventA?.getAttribute('href') ?? '';
    const id = eventIdFromHref(eventPath);
    if (id == null || byId.has(id)) continue; // hero wins on dupe
    const set: ProfileSet = { eventId: id, title: collapse(eventA?.textContent), eventPath, start: dataStart || dataEnd, fromHero: false };
    const clubA = row.querySelector('.dj-set-sub a');
    const clubName = collapse(clubA?.textContent);
    const clubPath = clubA?.getAttribute('href') ?? '';
    if (clubName) set.clubName = clubName;
    if (clubPath) set.clubPath = clubPath;
    if (dataEnd) set.end = dataEnd;
    byId.set(id, set);
  }

  return Array.from(byId.values());
}

export function parseEditPage(html: string): EditPageParse {
  const doc = parse(html);
  const container = doc.querySelector('#event-wizard-container');
  if (!container) throw new BridgeError('PARSE', 'edit page: #event-wizard-container missing');
  const rawEvent = container.getAttribute('data-event');
  if (!rawEvent) throw new BridgeError('PARSE', 'edit page: data-event missing');
  let dataEvent: VrcpopDataEvent;
  try {
    dataEvent = JSON.parse(rawEvent) as VrcpopDataEvent;
  } catch {
    throw new BridgeError('PARSE', 'edit page: data-event is not valid JSON');
  }
  const version = dataEvent.version;
  if (typeof version !== 'number') throw new BridgeError('PARSE', 'edit page: data-event.version missing (needed for optimistic lock)');
  const eventId = Number(container.getAttribute('data-event-id') ?? dataEvent.id);
  const groupId = container.getAttribute('data-group-id') ?? dataEvent.group_id;
  const sceneType = container.getAttribute('data-club-scene-type') || null;
  const sceneTypeSecondary = container.getAttribute('data-club-scene-type-secondary') || null;
  const defaultHosts = jsonAttr(container, 'data-default-hosts') ?? [];
  return {
    dataEvent,
    core: fromVrcpop(dataEvent),
    version,
    eventId,
    groupId,
    sceneType,
    sceneTypeSecondary,
    defaultHosts,
  };
}
