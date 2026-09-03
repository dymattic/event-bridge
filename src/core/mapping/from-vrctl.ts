// Parsed vrc.tl detail form (VrctlDetailForm) -> EventCore. Slot start times are
// reconstructed from the event start + cumulative contiguous durations.
import type { EventCore, Flags, IanaZone, IsoUtc, Performer, Slot, VrPlatform } from '../schema';
import type { VrctlDetailForm, VrctlFlagCategory, VrctlOption } from './vrctl-types';
import { addMinutes, asIanaZone, asIsoUtc, zonedLocalToUtc } from '../time';

export interface VrctlParseCtx {
  organizerName?: string;
  vrchatGroupId?: string;
}

function performerFromOption(o: VrctlOption): Performer {
  return { name: o.label, aliases: [{ platform: 'vrctl', id: o.id || undefined, name: o.label }] };
}

function labelOf(cat: VrctlFlagCategory | undefined, id: string): string | undefined {
  return cat?.options.find((o) => o.id === id)?.label;
}

function platformFromLabel(label: string): VrPlatform | undefined {
  const l = label.toLowerCase();
  if (l.includes('windows')) return 'windows';
  if (l.includes('android')) return 'android';
  if (l.includes('ios')) return 'ios';
  return undefined;
}

function readFlags(form: VrctlDetailForm): Flags {
  const flags: Flags = {};
  const sel = form.selectedFlags;

  const nsfwId = sel['1']?.[0];
  if (nsfwId) {
    const label = (labelOf(form.flagCategories['1'], nsfwId) ?? '').toLowerCase();
    if (label.includes('nsfw')) flags.nsfw = true;
    else if (label.includes('sfw')) flags.nsfw = false;
  }

  const platformIds = sel['2'] ?? [];
  const platforms = platformIds
    .map((id) => labelOf(form.flagCategories['2'], id))
    .filter((l): l is string => !!l)
    .map(platformFromLabel)
    .filter((p): p is VrPlatform => !!p);
  if (platforms.length) flags.platforms = platforms;

  if ((sel['3'] ?? []).length) flags.openDecks = true;
  if ((sel['4'] ?? []).length) flags.ageGated = true;

  const photoId = sel['5']?.[0];
  if (photoId) {
    const label = (labelOf(form.flagCategories['5'], photoId) ?? '').toLowerCase();
    if (label.includes('no flashing')) flags.photosensitivity = 'noFlashing';
    else if (label.includes('mild')) flags.photosensitivity = 'mild';
    else if (label.includes('severe')) flags.photosensitivity = 'severe';
    else if (label.includes('toggle')) flags.photosensitivity = 'withToggle';
  }

  const avatarId = sel['6']?.[0];
  if (avatarId) {
    const label = (labelOf(form.flagCategories['6'], avatarId) ?? '').toLowerCase();
    if (label) flags.avatarRestrictions = !label.includes('no avatar restriction');
  }

  return flags;
}

export function fromVrctl(form: VrctlDetailForm, ctx: VrctlParseCtx = {}): EventCore {
  const zoneStr = form.current.timezone ?? 'UTC';
  const zone: IanaZone = asIanaZone(zoneStr);
  const startLocal = form.current.start ?? '1970-01-01T00:00';
  const [datePart, timePart] = startLocal.split('T');
  const start: IsoUtc = datePart && timePart
    ? zonedLocalToUtc(datePart, timePart.slice(0, 5), zone)
    : asIsoUtc('1970-01-01T00:00:00Z');

  let cursor: IsoUtc = start;
  const lineup: Slot[] = form.slots.map((s, i) => {
    const dur = s.duration ?? 60;
    const slotStart = cursor;
    const slotEnd = addMinutes(slotStart, dur);
    cursor = slotEnd;
    return {
      order: i + 1,
      start: slotStart,
      end: slotEnd,
      performers: s.performers.map(performerFromOption),
      dancers: [],
      publicNote: s.publicNote,
      privateNote: s.privateNote,
    } satisfies Slot;
  });

  const organizerId = form.selectedOrganizerIds[0];
  return {
    title: form.current.name ?? '',
    description: form.current.description,
    start,
    end: lineup.length ? lineup[lineup.length - 1]?.end : undefined,
    zone,
    organizer: {
      name: ctx.organizerName ?? '',
      vrchatGroupId: ctx.vrchatGroupId,
      platformIds: organizerId ? { vrctl: organizerId } : {},
    },
    lineup,
    hosts: [],
    dancers: [],
    poster: form.current.posterUrl ? { kind: 'url', url: form.current.posterUrl } : undefined,
    visibility: { publish: form.current.published ?? false, audience: 'followers' },
    flags: readFlags(form),
    music: { genres: [] },
    links: { announcement: form.current.url || undefined },
    extras: { vrctl: { slotIds: form.slots.map((s) => s.id) } },
  };
}
