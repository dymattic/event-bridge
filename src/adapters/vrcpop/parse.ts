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
