// Shared platform-adapter contract. rave.page implements it first (P3); the
// vrcpop (P4) and vrc.tl (P5) adapters implement the same shape. Adapters own
// their transport + platform quirks; core/UI talk only to this interface.
//
// Agent-bound adapters (vrcpop/vrc.tl) self-bind their page-tab transport via
// `withAgent` inside each method, so the interface needs no transport/context
// param — it stays identical to the token-store-backed rave.page adapter. The
// only shared-type change P6 required is `PlatformCapabilities.draft` widening
// to a tri-state (see DraftSupport) so vrcpop's unverifiable draft flag fits
// `caps` without forcing a boolean; rave.page/vrc.tl keep passing `true`.
import type { EventCore, PlatformId, PosterFile, PosterRef } from '../core/schema';
import type { LossReport, PlatformCapabilities } from '../core/capabilities';
import type { PlannedStep } from '../core/planner';
import type { JsonValue } from '../core/hash';

// Extension-owned connection state (rave.page: token store; vrcpop/vrctl: page session).
export interface ConnectionStatus {
  connected: boolean;
  userId?: string;
  label?: string;
  expiresAt?: string; // ISO 8601
  reconnectSoon: boolean; // token near expiry -> UI should prompt a re-connect
}

// A manageable organizer/club the user can post events for.
export interface OwnClub {
  id: string; // organizer id (bare uuid or <prefix>_<uuid>)
  organizerType: string; // 'group' | 'club' | 'user'
  name: string;
  vrchatGroupId?: string; // cross-platform club anchor
  canOrganize: boolean;
}

export interface OrganizerFilter {
  organizerType: string;
  organizerId: string;
}

// Summary row for an own-events listing (never a public listing).
export interface OwnEvent {
  id: string;
  title: string;
  start?: string;
  status?: string;
  visibility?: string;
}

export interface VocabEntry {
  id: string;
  name: string;
  slug?: string;
}

export interface AdapterVocab {
  genres: VocabEntry[];
}

export interface PerformerMatch {
  id?: string;
  name: string;
}

export interface PlanResult {
  steps: PlannedStep[];
  report: LossReport;
}

export interface CreateOpts {
  organizer: OrganizerFilter;
  publish?: boolean; // default false -> draft/unlisted
  genreVocab?: Record<string, string>; // lowercased genre name -> slug (rave.page) / id
}

export interface UpdateOpts {
  id: string; // existing event id
  current: EventCore; // from readEvent (carries platform raw ids in extras)
  organizer?: OrganizerFilter;
  publish?: boolean;
  genreVocab?: Record<string, string>;
}

export interface PlatformAdapter {
  readonly id: PlatformId;
  readonly caps: PlatformCapabilities;
  session(): Promise<ConnectionStatus>;
  listOwnClubs(): Promise<OwnClub[]>;
  listOwnEvents(organizer: OrganizerFilter): Promise<OwnEvent[]>;
  readEvent(id: string): Promise<EventCore>;
  loadVocab(): Promise<AdapterVocab>;
  resolvePerformer(query: string): Promise<PerformerMatch[]>;
  planCreate(core: EventCore, opts: CreateOpts): PlanResult;
  planUpdate(core: EventCore, opts: UpdateOpts): PlanResult;
  planDelete(id: string): PlanResult;
  planPoster(id: string, poster: PosterRef | null): PlanResult;
  execute(step: PlannedStep): Promise<JsonValue>;
  // Poster bytes are uploaded imperatively (not a JSON plan step): chunked
  // media-upload then PATCH /events/{id}/poster.
  setPoster(id: string, file: PosterFile): Promise<void>;
  removePoster(id: string): Promise<void>;
}
