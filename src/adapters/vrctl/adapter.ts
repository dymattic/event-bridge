// vrc.tl own-surface reads + EventCore mapping. Pure: every function takes an
// injected `send` (the agent `http` op) so it is node/happy-dom importable and
// unit-tested with a fake transport. The webext-bound PlatformAdapter that the
// registry consumes lives in ./platform (imports the runtime agent).
import type { EventCore } from '../../core/schema';
import { fromVrctl } from '../../core/mapping/from-vrctl';
import type { VrctlDetailForm, VrctlFlagCategory, VrctlOption } from '../../core/mapping/vrctl-types';
import { BridgeError } from '../../core/errors';
import { dedupeGigs, isUpcomingGig, matchLineupNames, type Gig } from '../../core/gigs';
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

export interface VrctlGigsOpts {
  now: number;
  pace: () => Promise<void>; // >=300ms spacer (platform.ts); no-op in tests
  maxEventReads?: number;
}

// Own-club gigs: scan the admin grid, read each upcoming event's detail form,
// keep the ones whose lineup names a matching performer. Own-surface only — the
// public timeline is deliberately not read (policy), so gigs at clubs the user
// doesn't manage are not listed.
export async function listGigs(send: HttpSend, names: readonly string[], opts: VrctlGigsOpts): Promise<Gig[]> {
  if (names.length === 0) return [];
  const { now, pace } = opts;
  const maxReads = opts.maxEventReads ?? MAX_EVENT_READS;
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
  return dedupeGigs(gigs).filter((g) => isUpcomingGig(g, now));
}
