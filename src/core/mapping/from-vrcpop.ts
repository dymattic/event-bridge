// vrcpop edit-page `data-event` JSON (+ optional /api/event-lineup.php body)
// -> EventCore. Prefer `*_timestamp_utc` for instants. `version` (optimistic
// lock) is preserved in extras.vrcpop for read-before-write.
import type { EventCore, IanaZone, IsoUtc, Performer, Slot } from '../schema';
import { asIanaZone, asIsoUtc } from '../time';

export interface VrcpopDataEventPerformer {
  performer_name: string;
  performer_profile_id: number | null;
  dj_identity_id?: number | null;
}

export interface VrcpopDataEventSet {
  id?: number;
  set_order: number;
  start_timestamp_utc?: string | null;
  end_timestamp_utc?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  dj_name?: string | null;
  vj_name?: string | null;
  performers?: VrcpopDataEventPerformer[];
  genre_id?: number | null;
  energy_id?: number | null;
  notes?: string | null;
}

export interface VrcpopDataEvent {
  id: number;
  group_id: string;
  event_name: string;
  event_description?: string;
  flyer_url?: string;
  twitch_channel?: string | null;
  start_timestamp_utc?: string | null;
  end_timestamp_utc?: string | null;
  doors_open_timestamp_utc?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  owner_timezone: string;
  has_open_deck?: number | boolean;
  is_quest_compatible?: number | boolean;
  scene_type?: string | null;
  scene_type_secondary?: string | null;
  status?: string;
  version?: number;
  sets?: VrcpopDataEventSet[];
}

// vrcpop lineup body (/api/event-lineup.php) — richer slot detail when present.
export interface VrcpopLineupPerformer {
  name: string;
  profile_id: number | null;
}

export interface VrcpopLineupSet {
  set_id: number;
  set_order?: number;
  start_timestamp_utc?: string | null;
  end_timestamp_utc?: string | null;
  dj_name?: string | null;
  vj_name?: string | null;
  performers?: VrcpopLineupPerformer[];
  genre?: { id: number | null; name: string } | null;
  energy?: { id: number | null; name: string } | null;
  notes?: string | null;
}

export interface VrcpopLineupBody {
  event?: {
    group_name?: string;
    start_timestamp_utc?: string | null;
    end_timestamp_utc?: string | null;
    doors_open_timestamp_utc?: string | null;
  };
  lineup?: VrcpopLineupSet[];
}

// "YYYY-MM-DD HH:MM:SS" (assumed UTC) or ISO-with-Z -> IsoUtc.
function toIso(ts: string | null | undefined): IsoUtc | undefined {
  if (!ts) return undefined;
  const trimmed = ts.trim();
  if (/Z$/.test(trimmed)) return asIsoUtc(trimmed.replace(/\.\d+Z$/, 'Z'));
  const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})$/.exec(trimmed);
  if (m) return asIsoUtc(`${m[1]}T${m[2]}Z`);
  return undefined;
}

function truthy(v: number | boolean | undefined): boolean {
  return v === true || v === 1;
}

function perf(name: string, id: number | null): Performer {
  return { name, aliases: [{ platform: 'vrcpop', id: id === null ? undefined : String(id), name }] };
}

function slotFromData(s: VrcpopDataEventSet): Slot {
  const start = toIso(s.start_timestamp_utc);
  const performers: Performer[] = (s.performers ?? []).map((p) => perf(p.performer_name, p.performer_profile_id));
  if (performers.length === 0 && s.dj_name) performers.push(perf(s.dj_name, null));
  return {
    order: s.set_order,
    start: start ?? asIsoUtc('1970-01-01T00:00:00Z'),
    end: toIso(s.end_timestamp_utc),
    performers,
    vj: s.vj_name ? perf(s.vj_name, null) : undefined,
    dancers: [],
    notes: s.notes ?? undefined,
  };
}

function slotFromLineup(s: VrcpopLineupSet, order: number): Slot {
  const start = toIso(s.start_timestamp_utc);
  const performers: Performer[] = (s.performers ?? []).map((p) => perf(p.name, p.profile_id));
  if (performers.length === 0 && s.dj_name) performers.push(perf(s.dj_name, null));
  return {
    order: s.set_order ?? order,
    start: start ?? asIsoUtc('1970-01-01T00:00:00Z'),
    end: toIso(s.end_timestamp_utc),
    performers,
    vj: s.vj_name ? perf(s.vj_name, null) : undefined,
    dancers: [],
    genre: s.genre?.name,
    energy: s.energy?.name,
    notes: s.notes ?? undefined,
  };
}

export function fromVrcpop(data: VrcpopDataEvent, lineup?: VrcpopLineupBody): EventCore {
  const zone: IanaZone = asIanaZone(data.owner_timezone);
  const start = toIso(data.start_timestamp_utc) ?? asIsoUtc('1970-01-01T00:00:00Z');

  const useLineup = lineup?.lineup && lineup.lineup.length > 0;
  const slots: Slot[] = useLineup
    ? (lineup?.lineup ?? []).map((s, i) => slotFromLineup(s, i + 1))
    : (data.sets ?? []).map(slotFromData);
  slots.sort((a, b) => a.order - b.order);

  return {
    title: data.event_name,
    description: data.event_description ?? undefined,
    start,
    end: toIso(data.end_timestamp_utc),
    doorsOpen: toIso(data.doors_open_timestamp_utc),
    zone,
    organizer: {
      name: lineup?.event?.group_name ?? '',
      vrchatGroupId: data.group_id,
      platformIds: { vrcpop: data.group_id },
    },
    lineup: slots,
    hosts: [],
    dancers: [],
    poster: data.flyer_url ? { kind: 'url', url: data.flyer_url } : undefined,
    visibility: { publish: data.status === 'published', audience: 'public' },
    flags: {
      openDecks: truthy(data.has_open_deck),
      questCompatible: truthy(data.is_quest_compatible),
    },
    music: {
      genres: [],
      sceneType: data.scene_type ?? undefined,
      sceneTypeSecondary: data.scene_type_secondary ?? undefined,
    },
    links: { twitch: data.twitch_channel ?? undefined },
    extras: { vrcpop: { id: data.id, version: data.version, status: data.status } },
  };
}
