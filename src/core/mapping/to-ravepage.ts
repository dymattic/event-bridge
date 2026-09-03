// EventCore -> rave.page create payloads (generated model types). Event, slots,
// and performers are separate resources: a slot is created, then its performers
// reference it by slot_id (wired at run time via the planner, hence `slotIndex`).
// B2B = several performers sharing one slotIndex.
import type { EventCreateIn } from '../../adapters/ravepage/api-client/models/EventCreateIn';
import type { EventSlotCreateIn } from '../../adapters/ravepage/api-client/models/EventSlotCreateIn';
import type { EventPerformerCreateIn } from '../../adapters/ravepage/api-client/models/EventPerformerCreateIn';
import type { EventCore, Performer, Slot } from '../schema';

export interface RavepageBuildCtx {
  organizerType: string; // 'group' | 'club' | 'user' | ...
  organizerId: string; // bare uuid or <prefix>_<uuid>
  publish: boolean;
  genreVocab?: Record<string, string>; // lowercased genre name -> genre id
}

export interface RavepagePerformerBuild {
  slotIndex: number; // index into `slots`; slot_id resolved after slot create
  performer: EventPerformerCreateIn;
}

export interface RavepageEventBuild {
  event: EventCreateIn;
  slots: EventSlotCreateIn[];
  performers: RavepagePerformerBuild[];
  genreIds: string[]; // POST /taxonomy/entities/event/{id}/genres (P3)
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
    scene_type: core.music.sceneType,
    energy_level: core.music.energy,
    world_url: core.links.world,
    join_url: core.links.join,
    stream_url: core.links.stream,
    discord_invite_url: core.links.discord,
    external_event_url: core.links.announcement,
  };
  // Best-effort flag mapping; P3 confirms the accepted platform/age vocabularies.
  if (core.flags.platforms?.length) event.platforms = [...core.flags.platforms];
  if (core.flags.ageGated) event.age_gate = '18+';
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

  const genreIds: string[] = [];
  if (ctx.genreVocab) {
    for (const name of core.music.genres) {
      const id = ctx.genreVocab[name.toLowerCase()];
      if (id) genreIds.push(id);
    }
  }

  return { event, slots, performers, genreIds };
}
