// rave.page generated event/slot/performer models -> EventCore.
import type { EventOut } from '../../adapters/ravepage/api-client/models/EventOut';
import type { EventSlotOut } from '../../adapters/ravepage/api-client/models/EventSlotOut';
import type { EventPerformerOut } from '../../adapters/ravepage/api-client/models/EventPerformerOut';
import type { Audience, EventCore, IanaZone, IsoUtc, Performer, Slot, VrPlatform } from '../schema';
import { asIanaZone, asIsoUtc } from '../time';

// spec: EventOut.platforms tags are `pc`/`quest` — mirror to-ravepage's mapping.
function toVrPlatform(s: string): VrPlatform | undefined {
  const l = s.toLowerCase();
  if (l === 'pc' || l.includes('win')) return 'windows';
  if (l.includes('quest') || l.includes('android')) return 'android';
  if (l.includes('ios')) return 'ios';
  return undefined;
}

function performerFrom(p: EventPerformerOut): Performer {
  const name = p.stage_name ?? p.performer?.name ?? '';
  const id = p.performer_id;
  return { name, aliases: [{ platform: 'ravepage', id: id || undefined, name }] };
}

export function fromRavepage(
  event: EventOut,
  slots: EventSlotOut[] = [],
  performers: EventPerformerOut[] = [],
): EventCore {
  const zone: IanaZone = event.timezone ? asIanaZone(event.timezone) : asIanaZone('UTC');
  const start: IsoUtc = event.starts_at ? asIsoUtc(event.starts_at) : asIsoUtc('1970-01-01T00:00:00Z');

  const bySlot = new Map<string, EventPerformerOut[]>();
  const unassigned: EventPerformerOut[] = [];
  for (const p of performers) {
    if (p.slot_id) {
      const arr = bySlot.get(p.slot_id) ?? [];
      arr.push(p);
      bySlot.set(p.slot_id, arr);
    } else {
      unassigned.push(p);
    }
  }

  const ordered = [...slots].sort((a, b) => (a.slot_number ?? 0) - (b.slot_number ?? 0));
  const lineup: Slot[] = ordered.map((s, i) => {
    const sp = (s.id ? bySlot.get(s.id) : undefined) ?? [];
    sp.sort((a, b) => (a.billing_order ?? 0) - (b.billing_order ?? 0));
    return {
      order: s.slot_number ?? i + 1,
      start: s.starts_at ? asIsoUtc(s.starts_at) : start,
      end: s.ends_at ? asIsoUtc(s.ends_at) : undefined,
      title: s.slot_title,
      performers: sp.map(performerFrom),
      dancers: [],
    } satisfies Slot;
  });
  if (unassigned.length) {
    unassigned.sort((a, b) => (a.billing_order ?? 0) - (b.billing_order ?? 0));
    lineup.push({
      order: lineup.length + 1,
      start,
      performers: unassigned.map(performerFrom),
      dancers: [],
    });
  }

  const platforms = (event.platforms ?? [])
    .map(toVrPlatform)
    .filter((p): p is VrPlatform => !!p);

  return {
    title: event.title ?? '',
    description: event.description,
    start,
    end: event.ends_at ? asIsoUtc(event.ends_at) : undefined,
    zone,
    organizer: {
      name: '',
      platformIds: event.organizer_id ? { ravepage: event.organizer_id } : {},
    },
    lineup,
    hosts: [],
    dancers: [],
    poster: event.cover_image_url ? { kind: 'url', url: event.cover_image_url } : undefined,
    visibility: {
      publish: event.status !== 'draft' && event.is_public === true,
      audience: (event.visibility ?? 'unlisted') as Audience,
    },
    flags: {
      openDecks: event.open_decks ?? false,
      // spec: EventOut.age_gate — all_ages (or empty) = not gated.
      ageGated: !!event.age_gate && event.age_gate !== 'all_ages',
      platforms: platforms.length ? platforms : undefined,
    },
    music: {
      genres: event.tags ?? [],
      energy: event.energy_level,
      sceneType: event.scene_type,
    },
    links: {
      world: event.world_url,
      join: event.join_url,
      stream: event.stream_url,
      discord: event.discord_invite_url,
      announcement: event.external_event_url,
    },
    extras: {
      ravepage: { id: event.id, status: event.status, slug: event.slug, visibility: event.visibility },
    },
  };
}
