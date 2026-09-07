// vrc.tl own-surface reads + EventCore mapping. Pure: every function takes an
// injected `send` (the agent `http` op) so it is node/happy-dom importable and
// unit-tested with a fake transport. The webext-bound PlatformAdapter that the
// registry consumes lives in ./platform (imports the runtime agent).
import type { EventCore } from '../../core/schema';
import { fromVrctl } from '../../core/mapping/from-vrctl';
import type { VrctlDetailForm, VrctlFlagCategory, VrctlOption } from '../../core/mapping/vrctl-types';
import { BridgeError } from '../../core/errors';
import { dedupeGigs, isUpcomingGig, matchLineupNames, nameMatches, type Gig } from '../../core/gigs';
import { asIsoUtc } from '../../core/time';
import type { HttpSend } from './routes';
import { request } from './routes';
import {
  isSignInRedirect,
  parseChooseCategory,
  parseChooseOrganizer,
  parseDetailForm,
  parseGrid,
  parseGridDate,
  parsePerformerSearch,
  parseTimeline,
  type VrctlCategory,
  type VrctlGridRow,
  type VrctlOrganizer,
  type VrctlPerformer,
} from './parse';
import type { VrctlEventId, VrctlOrganizerId } from './ids';

function guard(res: { finalUrl: string; status: number; body?: string | null }): void {
  if (isSignInRedirect(res)) throw new BridgeError('NOT_LOGGED_IN', 'vrc.tl bounced to sign-in');
}

export interface VrctlVocab {
  organizerOptions: VrctlOption[];
  timezoneOptions: string[];
  howToJoinOptions: VrctlOption[];
  flagCategories: Record<string, VrctlFlagCategory>;
}

export async function listOwnClubs(send: HttpSend): Promise<VrctlOrganizer[]> {
  const res = await request(send, 'chooseOrganizer', {});
  guard(res);
  return parseChooseOrganizer(res.body ?? '');
}

export async function listCategories(send: HttpSend, organizerId: VrctlOrganizerId): Promise<VrctlCategory[]> {
  const res = await request(send, 'chooseCategory', { organizerId });
  guard(res);
  return parseChooseCategory(res.body ?? '');
}

export async function listOwnEvents(send: HttpSend): Promise<VrctlGridRow[]> {
  const res = await request(send, 'grid', {});
  guard(res);
  return parseGrid(res.body ?? '');
}

export async function readEventForm(send: HttpSend, eventId: VrctlEventId): Promise<VrctlDetailForm> {
  const res = await request(send, 'detail', { eventId });
  guard(res);
  if (!res.body) throw new BridgeError('NOT_FOUND', `no detail body for event ${eventId}`);
  return parseDetailForm(res.body);
}

export async function readEvent(send: HttpSend, eventId: VrctlEventId): Promise<{ form: VrctlDetailForm; core: EventCore }> {
  const form = await readEventForm(send, eventId);
  return { form, core: fromVrctl(form) };
}

export async function loadVocabForm(send: HttpSend, eventId: VrctlEventId): Promise<VrctlVocab> {
  const form = await readEventForm(send, eventId);
  return {
    organizerOptions: form.organizerOptions,
    timezoneOptions: form.timezoneOptions,
    howToJoinOptions: form.howToJoinOptions,
    flagCategories: form.flagCategories,
  };
}

export async function resolvePerformer(send: HttpSend, term: string): Promise<VrctlPerformer[]> {
  const res = await request(send, 'performerSearch', { term });
  guard(res);
  return parsePerformerSearch(res.body ?? '');
}

// ---- my gigs ----

// Human-scale cap on per-event detail reads per call.
export const MAX_EVENT_READS = 25;
// Human-scale cap on timeline pages per call (~3 days/page ≈ 36 days).
export const MAX_TIMELINE_PAGES = 12;
const DAY_MS = 86_400_000;

export interface VrctlGigsOpts {
  now: number;
  pace: () => Promise<void>; // >=300ms spacer (platform.ts); no-op in tests. Spaces BOTH sources.
  maxEventReads?: number;
  timelineDays?: number; // horizon for the public-timeline pass (default 30)
}

// Max 'YYYY-MM-DD' (lexicographic == chronological for zero-padded ISO dates).
function maxDay(days: readonly string[]): string | undefined {
  let m: string | undefined;
  for (const d of days) if (m === undefined || d > m) m = d;
  return m;
}

// Public-timeline gigs (owner-approved): page GET /api/v1/events the same way the
// vrc.tl app does — bare page = today ±1, then ?after=<last day of prev page> —
// until the newest day covers now+timelineDays, the page cap, or an empty page.
// Matches the user's names against slot performers, so it catches gigs at ANY
// club (not only ones the user manages). One gig per event (first matching slot).
async function scanTimeline(send: HttpSend, names: readonly string[], now: number, timelineDays: number, pace: () => Promise<void>): Promise<Gig[]> {
  const horizon = now + timelineDays * DAY_MS;
  const gigs: Gig[] = [];
  let after: string | undefined;
  for (let page = 0; page < MAX_TIMELINE_PAGES; page++) {
    await pace();
    const res = await request(send, 'timeline', after !== undefined ? { after } : {});
    const parsed = parseTimeline(res.body ?? '');
    if (parsed.days.length === 0) break;
    for (const ev of parsed.events) {
      const endMs = Date.parse(ev.end ?? ev.start);
      if (endMs < now) continue; // past
      for (const slot of ev.slots) {
        let matched: string | null = null;
        for (const pn of slot.performerNames) {
          const m = nameMatches(pn, names);
          if (m !== null) {
            matched = m;
            break;
          }
        }
        if (matched === null) continue;
        const gig: Gig = {
          platform: 'vrctl',
          eventId: ev.id,
          title: ev.name,
          eventUrl: `https://vrc.tl/event/${ev.id}`,
          start: asIsoUtc(ev.start),
          setStart: asIsoUtc(slot.start),
          setEnd: asIsoUtc(slot.end),
          matchedName: matched,
          status: 'confirmed',
          source: 'profile',
        };
        if (ev.organizerName !== undefined) gig.clubName = ev.organizerName;
        if (ev.end !== undefined) gig.end = asIsoUtc(ev.end);
        gigs.push(gig);
        break;
      }
    }
    const last = maxDay(parsed.days);
    if (last === undefined || Date.parse(`${last}T00:00:00Z`) >= horizon) break;
    after = last;
  }
  return gigs;
}

// Own-club gigs: scan the admin grid, read each upcoming event's detail form,
// keep the ones whose lineup names a matching performer. Also catches events
// whose slots are hidden publicly (showSlots:false) or where the user is only a
// host — the public timeline can't surface those.
async function scanOwnClubs(send: HttpSend, names: readonly string[], now: number, maxReads: number, pace: () => Promise<void>): Promise<Gig[]> {
  const rows = await listOwnEvents(send);
  const upcoming = rows.filter((r) => {
    const iso = parseGridDate(r.start);
    return iso === undefined || Date.parse(iso) >= now;
  });
  const gigs: Gig[] = [];
  let reads = 0;
  for (const row of upcoming) {
    if (reads >= maxReads) break;
    reads++;
    await pace();
    const { core } = await readEvent(send, row.eventId);
    const match = matchLineupNames(core, names);
    if (!match) continue;
    const id = String(row.eventId);
    gigs.push({
      platform: 'vrctl',
      eventId: id,
      title: core.title,
      eventUrl: `https://vrc.tl/event/${id}`,
      clubName: row.organizerName ?? core.organizer.name,
      start: core.start,
      end: core.end,
      setStart: match.setStart,
      setEnd: match.setEnd,
      matchedName: match.matchedName,
      status: 'confirmed',
      source: 'own-event',
    });
  }
  return gigs;
}

// Two sources, in order: the public timeline (owner-approved paged read) then
// the own-club scan. `dedupeGigs` collapses an event seen in both — the timeline
// (source 'profile') outranks 'own-event' — then the upcoming filter applies.
// Deterministic given `opts.now`.
export async function listGigs(send: HttpSend, names: readonly string[], opts: VrctlGigsOpts): Promise<Gig[]> {
  if (names.length === 0) return [];
  const { now, pace } = opts;
  const gigs = [
    ...(await scanTimeline(send, names, now, opts.timelineDays ?? 30, pace)),
    ...(await scanOwnClubs(send, names, now, opts.maxEventReads ?? MAX_EVENT_READS, pace)),
  ];
  return dedupeGigs(gigs).filter((g) => isUpcomingGig(g, now));
}
