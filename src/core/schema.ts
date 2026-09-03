// Platform-agnostic event interchange schema. Pure data; no transport, no DOM.
// Adapters map to/from this; UI edits it; planner turns it into steps.

export type PlatformId = 'vrcpop' | 'vrctl' | 'ravepage';

// Branded instant/zone strings. Constructors live in time.ts (asIsoUtc/asIanaZone).
export type IsoUtc = string & { readonly __brand: 'IsoUtc' };
export type IanaZone = string & { readonly __brand: 'IanaZone' };

export type Audience = 'public' | 'followers' | 'unlisted' | 'private';

// VRChat client platforms (vrc.tl "Platform" tag, rave.page `platforms`).
export type VrPlatform = 'windows' | 'android' | 'ios';

// vrc.tl photosensitivity tag (semantic; scraped option ids map at the adapter).
export type Photosensitivity = 'none' | 'noFlashing' | 'mild' | 'severe' | 'withToggle';

// Alias model from rave.page federation notes: no source owns identity.
// VRChat group id anchors club identity; per-platform performer ids live here.
export interface PerformerAlias {
  platform: PlatformId;
  id?: string;
  name: string;
}

export interface Performer {
  name: string;
  aliases: PerformerAlias[];
}

export interface OrganizerRef {
  name: string;
  vrchatGroupId?: string; // grp_<uuid>; cross-platform club anchor
  platformIds: Partial<Record<PlatformId, string>>;
}

// Poster source: a public URL, raw bytes (upload), or a reference already on a platform.
export type PosterRef =
  | { kind: 'url'; url: string }
  | { kind: 'bytes'; bytes: Uint8Array; mimeType: string; filename?: string; sha256?: string }
  | { kind: 'platform'; platform: PlatformId; ref: string };

// Concrete file for a multipart/chunked upload (adapter transport, P3/P5).
export interface PosterFile {
  bytes: Uint8Array;
  mimeType: string;
  filename: string;
}

export interface Visibility {
  publish: boolean;
  audience: Audience;
}

export interface Flags {
  nsfw?: boolean;
  ageGated?: boolean;
  openDecks?: boolean;
  questCompatible?: boolean;
  platforms?: VrPlatform[];
  photosensitivity?: Photosensitivity;
  avatarRestrictions?: boolean;
}

export interface Music {
  genres: string[]; // genre names; adapter resolves to platform ids
  energy?: string; // energy label/name
  sceneType?: string; // e.g. 'rave'
  sceneTypeSecondary?: string;
}

export interface Links {
  twitch?: string;
  announcement?: string; // X/Bluesky/Insta post (vrc.tl `url`, rave.page external_event_url)
  world?: string;
  join?: string;
  discord?: string;
  stream?: string;
}

export interface Slot {
  order: number; // 1-based
  start: IsoUtc;
  end?: IsoUtc;
  title?: string;
  performers: Performer[]; // >1 = B2B
  vj?: Performer;
  dancers: Performer[];
  genre?: string;
  energy?: string;
  notes?: string;
  publicNote?: string;
  privateNote?: string;
}

export interface EventCore {
  title: string;
  description?: string;
  start: IsoUtc;
  end?: IsoUtc;
  doorsOpen?: IsoUtc;
  zone: IanaZone;
  organizer: OrganizerRef;
  lineup: Slot[];
  hosts: Performer[];
  dancers: Performer[];
  poster?: PosterRef;
  visibility: Visibility;
  flags: Flags;
  music: Music;
  links: Links;
  // Per-platform raw round-trip fields (e.g. vrcpop `version`, vrc.tl slot ids).
  extras: Partial<Record<PlatformId, unknown>>;
}
