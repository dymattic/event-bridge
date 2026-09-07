// Data layer for the dashboard's real listings: connections, per-platform
// clubs+events, event reads, and the delete plan/execute. Wraps the adapter
// registry and enforces the loading discipline — reads to a third-party host are
// paced >=300 ms apart; platforms are loaded in parallel with each other by the
// callers (each useResource key runs its own loader). Registry imports the
// webext runtime, so this module is NOT node-importable — render tests mock it.
import type { EventCore } from '../../../core/schema';
import type { JsonValue } from '../../../core/hash';
import { renderPreview, resolveRefs } from '../../../core/planner';
import type { Gig } from '../../../core/gigs';
import { dedupeGigs, isUpcomingGig, sortGigs } from '../../../core/gigs';
import type { Platform } from '../../../shared/agent-protocol';
import { getAdapter } from '../../../adapters/registry';
import type { OwnClub, VocabEntry } from '../../../adapters/types';
import { getSessionStatus, type SessionState } from '../../../runtime/sessions';
import { status as ravepageStatus } from '../../../adapters/ravepage/auth';
import { isRavepageEnabled } from '../../../runtime/settings';
import { READ_GAP_MS, THIRD_PARTY } from '../../lib/platform-meta';
import { errorText } from '../../lib/error-copy';
import type { EventRow } from '../../lib/event-filters';

export interface PlatformConn {
  connected: boolean;
  label?: string;
  expiresAt?: string;
  state?: SessionState; // tab platforms: raw session state -> "why not checked" reason
}

export interface PlatformData {
  clubs: OwnClub[];
  events: EventRow[];
}

// Per-host min-gap between reads (user-agency, human scale). rave.page is our own
// API -> not paced.
const lastRead = new Map<Platform, number>();
export async function paceHost(platform: Platform): Promise<void> {
  if (!THIRD_PARTY[platform]) return;
  const wait = READ_GAP_MS - (Date.now() - (lastRead.get(platform) ?? 0));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRead.set(platform, Date.now());
}

export async function loadConnections(): Promise<Record<Platform, PlatformConn>> {
  const enabled = await isRavepageEnabled();
  const [vt, vp] = await Promise.all([getSessionStatus('vrctl'), getSessionStatus('vrcpop')]);
  const rp = enabled ? await ravepageStatus() : { connected: false, reconnectSoon: false, label: undefined, expiresAt: undefined };
  return {
    vrctl: { connected: vt.state === 'logged-in', label: vt.info?.label, state: vt.state },
    vrcpop: { connected: vp.state === 'logged-in', label: vp.info?.label, state: vp.state },
    ravepage: { connected: rp.connected, label: rp.label, expiresAt: rp.expiresAt },
  };
}

// "My gigs" across platforms. Each adapter is queried in PARALLEL (it paces its
// own reads); one platform failing lands in `errors[p]` (human copy) and never
// hides the others. Result = upcoming-only, deduped, sorted. Empty names -> no
// adapter call. Loads once per key + on explicit Refresh (the view's useResource
// with an infinite TTL) — NEVER on a timer.
export interface GigsLoad {
  gigs: Gig[];
  errors: Partial<Record<Platform, string>>;
  queried: Platform[];
}

export async function loadGigs(platforms: Platform[], names: string[], now = Date.now()): Promise<GigsLoad> {
  if (names.length === 0) return { gigs: [], errors: {}, queried: [] };
  const errors: Partial<Record<Platform, string>> = {};
  const results = await Promise.all(
    platforms.map(async (p) => {
      try {
        await paceHost(p);
        return await getAdapter(p).listGigs(names, { now });
      } catch (e) {
        errors[p] = errorText(e, p);
        return [] as Gig[];
      }
    }),
  );
  const gigs = sortGigs(dedupeGigs(results.flat().filter((g) => isUpcomingGig(g, now))));
  return { gigs, errors, queried: platforms };
}

// Own clubs -> own events per club (sequential + paced for third-party hosts).
export async function loadPlatformData(platform: Platform): Promise<PlatformData> {
  const adapter = getAdapter(platform);
  await paceHost(platform);
  const clubs = await adapter.listOwnClubs();
  const events: EventRow[] = [];
  for (const club of clubs) {
    await paceHost(platform);
    const own = await adapter.listOwnEvents({ organizerType: club.organizerType, organizerId: club.id });
    for (const e of own) {
      events.push({
        platform,
        id: e.id,
        title: e.title,
        start: e.start,
        status: e.status,
        visibility: e.visibility,
        clubId: club.id,
        clubName: club.name,
      });
    }
  }
  return { clubs, events };
}

export async function readEventCore(platform: Platform, id: string): Promise<EventCore> {
  await paceHost(platform);
  return getAdapter(platform).readEvent(id);
}

// Genre vocabulary for one platform (names + slug/id), for the editor's genre
// picker + genreVocab map. Paced like any third-party read.
export async function loadGenreVocab(platform: Platform): Promise<VocabEntry[]> {
  await paceHost(platform);
  return (await getAdapter(platform).loadVocab()).genres;
}

// Human-readable, exact preview of the delete request(s) — shown before confirm.
export function deletePreview(platform: Platform, id: string): string[] {
  return getAdapter(platform).planDelete(id).steps.map(renderPreview);
}

export interface DeleteStepEvent {
  stepId: string;
  status: 'running' | 'done' | 'error';
  request: JsonValue;
  error?: { code?: string; message: string };
}

export async function executeDelete(platform: Platform, id: string, onStep?: (evt: DeleteStepEvent) => void): Promise<void> {
  const adapter = getAdapter(platform);
  const { steps } = adapter.planDelete(id);
  const results: Record<string, JsonValue> = {};
  for (const step of steps) {
    const resolved = resolveRefs(step, results);
    onStep?.({ stepId: step.id, status: 'running', request: resolved.request });
    await paceHost(platform);
    try {
      results[step.id] = await adapter.execute(resolved);
      onStep?.({ stepId: step.id, status: 'done', request: resolved.request });
    } catch (e) {
      onStep?.({ stepId: step.id, status: 'error', request: resolved.request, error: { message: e instanceof Error ? e.message : String(e) } });
      throw e;
    }
  }
}
