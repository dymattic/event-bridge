// EventCore -> vrc.tl Nette form fields. Two stages:
//   buildVrctlCreateFields  -> urlencoded create POST (name/start/tz/slots/duration)
//   buildVrctlDetailFields  -> ordered multipart detail POST (slots[], flags[], poster)
// vrc.tl slots are contiguous durations (no per-slot start): gaps in the core
// are unrepresentable and surface via computeLoss(approximated). Flag option ids
// are read from the scraped VrctlDetailForm — never hardcoded.
import type { EventCore, PosterFile, Slot, VrPlatform } from '../schema';
import type { VrctlDetailForm, VrctlFlagCategory } from './vrctl-types';
import { diffMinutes, toDatetimeLocal } from '../time';

export type VrctlField = [string, string] | [string, { file: PosterFile }];

export interface VrctlCreateCtx {
  organizerId: string;
  categoryId?: string;
  timezone?: string; // defaults to core.zone
  duration?: number; // default slot duration minutes
}

export interface VrctlDetailCtx {
  publish: boolean; // emits `published=on` only when true
  organizerId?: string; // defaults to form selection / core platform id
  timezone?: string; // defaults to core.zone
  poster?: PosterFile; // when present -> posterType=upload + posterUpload
}

const DUR_MIN = 30;
const DUR_MAX = 240;

function clampDuration(mins: number): number {
  return Math.max(DUR_MIN, Math.min(DUR_MAX, Math.round(mins)));
}

// Contiguous per-slot durations. A slot's length is its own end-start; if no end,
// it fills to the next slot start; last slot falls back to `fallback`.
function slotDurations(core: EventCore, fallback: number): number[] {
  const slots = [...core.lineup].sort((a, b) => a.order - b.order);
  return slots.map((s, i) => {
    if (s.end) return clampDuration(diffMinutes(s.start, s.end));
    const next = slots[i + 1];
    if (next) return clampDuration(diffMinutes(s.start, next.start));
    return clampDuration(fallback);
  });
}

export function buildVrctlCreateFields(core: EventCore, ctx: VrctlCreateCtx): Array<[string, string]> {
  const zone = ctx.timezone ?? core.zone;
  const durations = slotDurations(core, ctx.duration ?? 60);
  const firstDuration = durations[0] ?? clampDuration(ctx.duration ?? 60);
  return [
    ['name', core.title.slice(0, 40)],
    ['start', toDatetimeLocal(core.start, zone)],
    ['timezone', zone],
    ['slots', String(Math.max(1, core.lineup.length))],
    ['duration', String(firstDuration)],
    ['_submit', 'Save'],
    ['_do', 'form-form-submit'],
  ];
}

function optionIdByLabel(cat: VrctlFlagCategory | undefined, ...needles: string[]): string | undefined {
  if (!cat) return undefined;
  const lc = needles.map((n) => n.toLowerCase());
  const hit = cat.options.find((o) => o.id !== '' && lc.some((n) => o.label.toLowerCase().includes(n)));
  return hit?.id;
}

const PLATFORM_LABEL: Record<VrPlatform, string> = { windows: 'Windows', android: 'Android', ios: 'iOS' };

function performerFields(slot: Slot, slotId: string, out: VrctlField[]): void {
  // id preferred (select2 value), else free-text name (data-tags="true").
  const values =
    slot.performers.length > 0
      ? slot.performers.map((p) => p.aliases.find((a) => a.platform === 'vrctl' && a.id)?.id ?? p.name)
      : [];
  for (const v of values) out.push([`slots[${slotId}][performers][]`, v]);
}

export function buildVrctlDetailFields(core: EventCore, form: VrctlDetailForm, ctx: VrctlDetailCtx): VrctlField[] {
  const zone = ctx.timezone ?? core.zone;
  const organizerId = ctx.organizerId ?? form.selectedOrganizerIds[0] ?? core.organizer.platformIds.vrctl ?? '';
  const out: VrctlField[] = [];

  out.push(['organizers[]', organizerId]);
  out.push(['name', core.title.slice(0, 40)]);
  out.push(['description', core.description ?? '']);

  const openMinutes = core.doorsOpen ? diffMinutes(core.doorsOpen, core.start) : 0;
  const openClamped = openMinutes <= 0 ? 0 : Math.max(15, Math.min(60, openMinutes));
  out.push(['instanceOpenMinutesBeforeStart', String(openClamped)]);

  out.push(['start', toDatetimeLocal(core.start, zone)]);
  out.push(['timezone', zone]);
  out.push(['url', core.links.announcement ?? '']);

  const howToJoin = form.selectedHowToJoin ?? form.howToJoinOptions[0]?.id ?? (organizerId ? `group-${organizerId}` : '');
  out.push(['howToJoin', howToJoin]);
  out.push(['showSlots', 'on']);

  if (ctx.publish) out.push(['published', 'on']);

  // Slots: map core lineup to the scraped slot ids by order.
  const durations = slotDurations(core, 60);
  const slots = [...core.lineup].sort((a, b) => a.order - b.order);
  form.slots.forEach((formSlot, i) => {
    const slot = slots[i];
    if (!slot) return;
    out.push([`slots[${formSlot.id}][duration]`, String(durations[i] ?? 60)]);
    out.push([`slots[${formSlot.id}][flag]`, formSlot.flag ?? 'performers']);
    performerFields(slot, formSlot.id, out);
    out.push([`slots[${formSlot.id}][publicNote]`, slot.publicNote ?? '']);
    out.push([`slots[${formSlot.id}][privateNote]`, slot.privateNote ?? '']);
  });

  // flags[1] NSFW/SFW (required). Omit when undefined -> computeLoss reports required.
  if (core.flags.nsfw !== undefined) {
    const id = core.flags.nsfw
      ? optionIdByLabel(form.flagCategories['1'], 'nsfw')
      : optionIdByLabel(form.flagCategories['1'], 'sfw');
    if (id) out.push(['flags[1]', id]);
  }

  // flags[2][] Platform (max 3).
  if (core.flags.platforms?.length) {
    const cat = form.flagCategories['2'];
    for (const p of core.flags.platforms.slice(0, 3)) {
      const id = optionIdByLabel(cat, PLATFORM_LABEL[p]);
      if (id) out.push(['flags[2][]', id]);
    }
  }

  // flags[3] Open decks (checkbox).
  if (core.flags.openDecks) out.push(['flags[3]', 'on']);
  // flags[4] Age gated (checkbox).
  if (core.flags.ageGated) out.push(['flags[4]', 'on']);

  // flags[5] Photosensitivity (radio).
  if (core.flags.photosensitivity && core.flags.photosensitivity !== 'none') {
    const map: Record<string, string[]> = {
      noFlashing: ['no flashing'],
      mild: ['mild'],
      severe: ['severe'],
      withToggle: ['toggle'],
    };
    const needles = map[core.flags.photosensitivity] ?? [];
    const id = optionIdByLabel(form.flagCategories['5'], ...needles);
    if (id) out.push(['flags[5]', id]);
  }

  // flags[6] Avatar restriction (radio).
  if (core.flags.avatarRestrictions !== undefined) {
    const cat = form.flagCategories['6'];
    const id = core.flags.avatarRestrictions
      ? cat?.options.find((o) => o.id !== '' && !o.label.toLowerCase().includes('no avatar restriction'))?.id
      : optionIdByLabel(cat, 'no avatar restriction');
    if (id) out.push(['flags[6]', id]);
  }

  // Poster. The live form always submits posterType (+ posterUrl for 'url');
  // omitting it on an update would drop an existing poster, so with no poster
  // in core we re-submit whatever URL the scraped form currently holds.
  if (ctx.poster) {
    out.push(['posterType', 'upload']);
    out.push(['posterUpload', { file: ctx.poster }]);
  } else if (core.poster && core.poster.kind === 'url') {
    out.push(['posterType', 'url']);
    out.push(['posterUrl', core.poster.url]);
  } else {
    out.push(['posterType', 'url']);
    out.push(['posterUrl', form.current.posterUrl ?? '']);
  }

  out.push(['_submit', 'Save']);
  out.push(['_do', form.doValue || 'form-form-submit']);
  return out;
}
