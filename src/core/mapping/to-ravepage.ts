// EventCore -> rave.page create payloads (generated model types). Event, slots,
// and performers are separate resources: a slot is created, then its performers
// reference it by slot_id (wired at run time via the planner, hence `slotIndex`).
// B2B = several performers sharing one slotIndex.
import type { EventCreateIn } from '../../adapters/ravepage/api-client/models/EventCreateIn';
import type { EventSlotCreateIn } from '../../adapters/ravepage/api-client/models/EventSlotCreateIn';
import type { EventPerformerCreateIn } from '../../adapters/ravepage/api-client/models/EventPerformerCreateIn';
import type { LossEntry } from '../capabilities';
import type { EventCore, Performer, Slot, VrPlatform } from '../schema';

export interface RavepageBuildCtx {
  organizerType: string; // 'group' | 'club' | 'user' | ...
  organizerId: string; // bare uuid or <prefix>_<uuid>
  publish: boolean;
  genreVocab?: Record<string, string>; // lowercased genre name -> genre slug
}

export interface RavepagePerformerBuild {
  slotIndex: number; // index into `slots`; slot_id resolved after slot create
  performer: EventPerformerCreateIn;
}

export interface RavepageEventBuild {
  event: EventCreateIn;
  slots: EventSlotCreateIn[];
  performers: RavepagePerformerBuild[];
  genreSlugs: string[]; // PUT /taxonomy/event/{id}/genres (setEntityManualGenres)
  dropped: LossEntry[]; // vocab-level drops the generic capability table misses
}

// spec: EventOut.platforms — "list of platform tags (`pc`, `quest`, etc.)".
function mapPlatform(vp: VrPlatform): string | undefined {
  switch (vp) {
    case 'windows':
      return 'pc';
    case 'android':
      return 'quest';
    default:
      return undefined; // ios: no tag in the spec vocabulary -> dropped
  }
}

// spec: EventOut.energy_level — "one of `chill | medium | high | extreme`".
const ENERGY = ['chill', 'medium', 'high', 'extreme'] as const;
function mapEnergy(s?: string): string | undefined {
  if (!s) return undefined;
  const l = s.toLowerCase();
  return ENERGY.find((e) => l === e || l.includes(e));
}

// spec: EventOut.scene_type — "one of `club | festival | rave | concert | showcase`".
const SCENE = ['club', 'festival', 'rave', 'concert', 'showcase'] as const;
function mapScene(s?: string): string | undefined {
  if (!s) return undefined;
  const l = s.toLowerCase();
  return SCENE.find((v) => l === v || l.includes(v));
}

function performerBuild(p: Performer, slot: Slot, slotIndex: number, order: number): RavepagePerformerBuild {
  const id = p.aliases.find((a) => a.platform === 'ravepage' && a.id)?.id;
  const performer: EventPerformerCreateIn = {
    billing_order: order,
    starts_at: slot.start,
    ends_at: slot.end,
    slot_title: slot.title,
    genre_tags: slot.genre ? [slot.genre] : undefined,
  };
  if (id) performer.performer_id = id;
  else performer.performer_name = p.name;
  return { slotIndex, performer };
}

export function toRavepage(core: EventCore, ctx: RavepageBuildCtx): RavepageEventBuild {
  const dropped: LossEntry[] = [];
  const event: EventCreateIn = {
    title: core.title,
    description: core.description,
    organizer_type: ctx.organizerType,
    organizer_id: ctx.organizerId,
    starts_at: core.start,
    ends_at: core.end,
    timezone: core.zone,
    status: ctx.publish ? 'scheduled' : 'draft',
    visibility: ctx.publish ? 'public' : 'unlisted',
    is_public: ctx.publish,
    open_decks: core.flags.openDecks ?? false,
    scene_type: mapScene(core.music.sceneType), // spec: EventOut.scene_type
    energy_level: mapEnergy(core.music.energy), // spec: EventOut.energy_level
    world_url: core.links.world,
    join_url: core.links.join,
    stream_url: core.links.stream,
    discord_invite_url: core.links.discord,
    external_event_url: core.links.announcement,
  };
  if (core.music.sceneType && !event.scene_type) {
    dropped.push({ path: 'music.sceneType', reason: `rave.page scene_type has no value for "${core.music.sceneType}"` });
  }
  if (core.music.energy && !event.energy_level) {
    dropped.push({ path: 'music.energy', reason: `rave.page energy_level has no value for "${core.music.energy}"` });
  }

  // platforms: core windows/android/ios -> rave.page pc/quest; ios has no tag.
  if (core.flags.platforms?.length) {
    const tags: string[] = [];
    for (const vp of core.flags.platforms) {
      const t = mapPlatform(vp);
      if (t) tags.push(t);
      else dropped.push({ path: 'flags.platforms', reason: `rave.page has no platform tag for ${vp}` });
    }
    if (tags.length) event.platforms = tags;
  }
  // spec: EventOut.age_gate — "all_ages | 18_plus | 21_plus" (all_ages = unset).
  if (core.flags.ageGated) event.age_gate = '18_plus';
  if (core.poster && core.poster.kind === 'url') event.cover_image_url = core.poster.url;

  const orderedSlots = [...core.lineup].sort((a, b) => a.order - b.order);
  const slots: EventSlotCreateIn[] = orderedSlots.map((s, i) => ({
    slot_number: s.order ?? i + 1,
    slot_title: s.title,
    starts_at: s.start,
    ends_at: s.end,
  }));

  const performers: RavepagePerformerBuild[] = [];
  orderedSlots.forEach((s, i) => {
    s.performers.forEach((p, j) => performers.push(performerBuild(p, s, i, j)));
  });

  const genreSlugs: string[] = [];
  if (ctx.genreVocab) {
    for (const name of core.music.genres) {
      const slug = ctx.genreVocab[name.toLowerCase()];
      if (slug) genreSlugs.push(slug);
    }
  }

  return { event, slots, performers, genreSlugs, dropped };
}
