// EventCore -> vrcpop action=create|update JSON payload. Field names/values
// mirror the captured wizard payload verbatim. Times are LOCAL HH:MM / YYYY-MM-DD
// in owner_timezone (vrcpop stores wall time + zone, computes UTC server-side).
import type { EventCore, Performer, Slot } from '../schema';
import { utcToZonedParts } from '../time';

export interface VrcpopVocabItem {
  id: number;
  name: string;
}

export interface VrcpopBuildCtx {
  groupId: string; // grp_<uuid>
  ownerTimezone: string; // IANA
  publish: boolean; // false => status:'draft'
  eventId?: number; // update only
  version?: number; // update only (optimistic lock)
  vocab?: { genres?: VrcpopVocabItem[]; energies?: VrcpopVocabItem[] };
}

export interface VrcpopPerformerPayload {
  name: string;
  profile_id: number | null;
}

export interface VrcpopSetPayload {
  set_order: number;
  start_time: string | null; // local HH:MM
  end_time: string | null;
  performers: VrcpopPerformerPayload[];
  vj_name: string | null;
  vj_profile_id: number | null;
  dancer_name: string | null;
  dancer_profile_id: number | null;
  dancers: VrcpopPerformerPayload[];
  genre_id: number | null;
  custom_genre_name: string | null;
  custom_genre_color: string | null;
  energy_id: number | null;
  notes: string | null;
}

export interface VrcpopEventPayload {
  action: 'create' | 'update';
  group_id: string;
  event_name: string;
  event_description: string;
  event_date: string; // local YYYY-MM-DD
  start_time: string; // local HH:MM
  doors_open: string | null;
  end_time: string | null;
  owner_timezone: string;
  default_genre_id: number | null;
  custom_genre_name: string | null;
  custom_genre_color: string | null;
  scene_type: string | null;
  scene_type_secondary: string | null;
  default_energy_id: number | null;
  has_open_deck: boolean;
  is_quest_compatible: boolean;
  twitch_channel: string | null;
  flyer_url: string;
  status: 'draft' | 'published';
  hosts: VrcpopPerformerPayload[];
  event_dancers: VrcpopPerformerPayload[];
  sets: VrcpopSetPayload[];
  event_id?: number;
  version?: number;
}

function vrcpopAliasId(p: Performer): number | null {
  const a = p.aliases.find((x) => x.platform === 'vrcpop' && x.id !== undefined);
  if (!a || a.id === undefined) return null;
  const n = Number(a.id);
  return Number.isFinite(n) ? n : null;
}

function localTime(iso: string | undefined, zone: string): string | null {
  if (!iso) return null;
  return utcToZonedParts(iso, zone).time;
}

function performerPayload(p: Performer): VrcpopPerformerPayload {
  return { name: p.name, profile_id: vrcpopAliasId(p) };
}

function lookupId(vocab: VrcpopVocabItem[] | undefined, name: string | undefined): number | null {
  if (!vocab || !name) return null;
  const hit = vocab.find((v) => v.name.toLowerCase() === name.toLowerCase());
  return hit ? hit.id : null;
}

function setPayload(slot: Slot, zone: string, ctx: VrcpopBuildCtx): VrcpopSetPayload {
  const vj = slot.vj;
  return {
    set_order: slot.order,
    start_time: localTime(slot.start, zone),
    end_time: localTime(slot.end, zone),
    performers: slot.performers.map(performerPayload),
    vj_name: vj ? vj.name : null,
    vj_profile_id: vj ? vrcpopAliasId(vj) : null,
    dancer_name: null,
    dancer_profile_id: null,
    dancers: slot.dancers.map(performerPayload),
    genre_id: lookupId(ctx.vocab?.genres, slot.genre),
    custom_genre_name: null,
    custom_genre_color: null,
    energy_id: lookupId(ctx.vocab?.energies, slot.energy),
    notes: slot.notes ?? null,
  };
}

export function toVrcpopPayload(core: EventCore, ctx: VrcpopBuildCtx): VrcpopEventPayload {
  const zone = ctx.ownerTimezone;
  const startParts = utcToZonedParts(core.start, zone);
  const action: 'create' | 'update' = ctx.eventId !== undefined ? 'update' : 'create';

  const payload: VrcpopEventPayload = {
    action,
    group_id: ctx.groupId,
    event_name: core.title,
    event_description: core.description ?? '',
    event_date: startParts.date,
    start_time: startParts.time,
    doors_open: localTime(core.doorsOpen, zone),
    end_time: localTime(core.end, zone),
    owner_timezone: zone,
    default_genre_id: lookupId(ctx.vocab?.genres, core.music.genres[0]),
    custom_genre_name: null,
    custom_genre_color: null,
    scene_type: core.music.sceneType ?? null,
    scene_type_secondary: core.music.sceneTypeSecondary ?? null,
    default_energy_id: lookupId(ctx.vocab?.energies, core.music.energy),
    has_open_deck: core.flags.openDecks ?? false,
    is_quest_compatible: core.flags.questCompatible ?? false,
    twitch_channel: core.links.twitch ?? null,
    flyer_url: core.poster && core.poster.kind === 'url' ? core.poster.url : '',
    status: ctx.publish ? 'published' : 'draft',
    hosts: core.hosts.map(performerPayload),
    event_dancers: core.dancers.map(performerPayload),
    sets: [...core.lineup].sort((a, b) => a.order - b.order).map((s) => setPayload(s, zone, ctx)),
  };

  if (action === 'update') {
    payload.event_id = ctx.eventId;
    payload.version = ctx.version;
  }
  return payload;
}
