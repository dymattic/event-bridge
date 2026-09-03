// Static per-platform capability tables + loss computation.
import type { EventCore, Flags, PlatformId } from './schema';

export type FlagKey = keyof Flags;

export type FlagSupport = Partial<Record<FlagKey, boolean>>;

export interface PlatformCapabilities {
  platform: PlatformId;
  draft: boolean; // real draft state (not forced publish)
  vj: boolean;
  dancers: boolean;
  hosts: boolean;
  perSlotGenre: boolean;
  perSlotEnergy: boolean;
  b2b: boolean; // >1 performer per slot
  slotGaps: boolean; // gaps between slots representable
  posterUrl: boolean;
  posterUpload: boolean;
  flags: FlagSupport;
  descriptionMaxLength?: number;
  requiredFields: string[]; // core paths the platform requires (e.g. 'flags.nsfw')
}

// vrcpop: JSON wizard. Drafts exist (draft cards + bulk-publish). Genre/energy
// taxonomies + VJ/dancers. Poster via upload (external flyer_url untested).
// Tag-based NSFW/age (no per-event flag), so those flags are unsupported here.
export const VRCPOP_CAPS: PlatformCapabilities = {
  platform: 'vrcpop',
  draft: true,
  vj: true,
  dancers: true,
  hosts: true,
  perSlotGenre: true,
  perSlotEnergy: true,
  b2b: true,
  slotGaps: true, // sets carry explicit start/end
  posterUrl: false,
  posterUpload: true,
  flags: { openDecks: true, questCompatible: true },
  requiredFields: [],
};

// vrc.tl: Nette forms. No VJ/dancers/hosts, no per-slot genre/energy. Slots are
// contiguous durations (no gaps). NSFW/SFW radio required. Poster url or upload.
export const VRCTL_CAPS: PlatformCapabilities = {
  platform: 'vrctl',
  draft: true, // "Publish to Timeline" unchecked = draft
  vj: false,
  dancers: false,
  hosts: false,
  perSlotGenre: false,
  perSlotEnergy: false,
  b2b: true, // slots[<id>][performers][] multi
  slotGaps: false,
  posterUrl: true,
  posterUpload: true,
  flags: {
    nsfw: true,
    ageGated: true,
    openDecks: true,
    platforms: true,
    photosensitivity: true,
    avatarRestrictions: true,
    questCompatible: false,
  },
  descriptionMaxLength: undefined,
  requiredFields: ['flags.nsfw'],
};

// rave.page: REST API. Performers (no VJ/dancers/hosts split). Slots carry
// explicit times (gaps ok). Poster via url or chunked upload. NSFW/age via
// age_gate + content/restriction flags; platforms array; open decks.
export const RAVEPAGE_CAPS: PlatformCapabilities = {
  platform: 'ravepage',
  draft: true,
  vj: false,
  dancers: false,
  hosts: false,
  perSlotGenre: false, // genre_tags live on the performer, not the slot
  perSlotEnergy: false, // energy_level is event-level
  b2b: true,
  slotGaps: true,
  posterUrl: true,
  posterUpload: true,
  flags: {
    nsfw: true,
    ageGated: true,
    openDecks: true,
    platforms: true,
    questCompatible: false,
    photosensitivity: false,
    avatarRestrictions: false,
  },
  requiredFields: [],
};

export const CAPS: Record<PlatformId, PlatformCapabilities> = {
  vrcpop: VRCPOP_CAPS,
  vrctl: VRCTL_CAPS,
  ravepage: RAVEPAGE_CAPS,
};

export interface LossEntry {
  path: string;
  reason: string;
}

export interface LossReport {
  dropped: LossEntry[]; // present in core, cannot be represented -> discarded
  approximated: LossEntry[]; // representable only with a lossy transform
  required: LossEntry[]; // platform requires a value the core doesn't supply
}

function anySlot<T>(core: EventCore, pick: (s: EventCore['lineup'][number], i: number) => T | undefined): boolean {
  return core.lineup.some((s, i) => pick(s, i) !== undefined);
}

export function computeLoss(core: EventCore, caps: PlatformCapabilities): LossReport {
  const dropped: LossEntry[] = [];
  const approximated: LossEntry[] = [];
  const required: LossEntry[] = [];

  // VJ / dancers / hosts.
  if (!caps.vj) {
    core.lineup.forEach((s, i) => {
      if (s.vj) dropped.push({ path: `lineup.${i}.vj`, reason: `${caps.platform} has no VJ slot` });
    });
  }
  if (!caps.dancers) {
    if (core.dancers.length) dropped.push({ path: 'dancers', reason: `${caps.platform} has no dancers` });
    core.lineup.forEach((s, i) => {
      if (s.dancers.length) dropped.push({ path: `lineup.${i}.dancers`, reason: `${caps.platform} has no dancers` });
    });
  }
  if (!caps.hosts && core.hosts.length) {
    dropped.push({ path: 'hosts', reason: `${caps.platform} has no hosts list` });
  }

  // Per-slot genre / energy.
  if (!caps.perSlotGenre && anySlot(core, (s) => s.genre)) {
    dropped.push({ path: 'lineup.*.genre', reason: `${caps.platform} has no per-slot genre` });
  }
  if (!caps.perSlotEnergy && anySlot(core, (s) => s.energy)) {
    dropped.push({ path: 'lineup.*.energy', reason: `${caps.platform} has no per-slot energy` });
  }

  // B2B (all current platforms support it; guard anyway).
  if (!caps.b2b && core.lineup.some((s) => s.performers.length > 1)) {
    approximated.push({ path: 'lineup.*.performers', reason: `${caps.platform} keeps only the first performer per slot` });
  }

  // Slot gaps -> contiguous durations.
  if (!caps.slotGaps && hasGaps(core)) {
    approximated.push({ path: 'lineup', reason: `${caps.platform} slots are contiguous; gaps removed` });
  }

  // Poster.
  if (core.poster) {
    if (core.poster.kind === 'url' && !caps.posterUrl && caps.posterUpload) {
      approximated.push({ path: 'poster', reason: `${caps.platform} needs an upload; url will be fetched + uploaded` });
    } else if (core.poster.kind === 'bytes' && !caps.posterUpload && caps.posterUrl) {
      approximated.push({ path: 'poster', reason: `${caps.platform} needs a url; upload not supported` });
    } else if (
      (core.poster.kind === 'url' && !caps.posterUrl && !caps.posterUpload) ||
      (core.poster.kind === 'bytes' && !caps.posterUpload && !caps.posterUrl)
    ) {
      dropped.push({ path: 'poster', reason: `${caps.platform} has no poster support` });
    }
  }

  // Flags set in core but unsupported by the platform.
  for (const key of Object.keys(core.flags) as FlagKey[]) {
    const v = core.flags[key];
    const isSet = Array.isArray(v) ? v.length > 0 : v !== undefined && v !== false;
    if (isSet && caps.flags[key] !== true) {
      dropped.push({ path: `flags.${key}`, reason: `${caps.platform} does not support flag ${key}` });
    }
  }

  // Required fields the core doesn't supply.
  for (const field of caps.requiredFields) {
    if (isMissing(core, field)) {
      required.push({ path: field, reason: `${caps.platform} requires ${field}` });
    }
  }

  // Description length.
  if (caps.descriptionMaxLength !== undefined && core.description && core.description.length > caps.descriptionMaxLength) {
    approximated.push({ path: 'description', reason: `truncated to ${caps.descriptionMaxLength} chars` });
  }

  return { dropped, approximated, required };
}

function hasGaps(core: EventCore): boolean {
  const slots = [...core.lineup].sort((a, b) => a.order - b.order);
  for (let i = 1; i < slots.length; i++) {
    const prev = slots[i - 1];
    const cur = slots[i];
    if (!prev || !cur || prev.end === undefined) continue;
    if (Date.parse(cur.start) > Date.parse(prev.end)) return true;
  }
  return false;
}

// Only the fields a platform can require today (extend as needed).
function isMissing(core: EventCore, field: string): boolean {
  switch (field) {
    case 'flags.nsfw':
      return core.flags.nsfw === undefined;
    case 'title':
      return !core.title.trim();
    case 'start':
      return !core.start;
    default:
      return false;
  }
}
