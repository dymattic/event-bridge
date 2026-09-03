/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MetadataConsensusBestOut } from './MetadataConsensusBestOut';
import type { TrackArtistOut } from './TrackArtistOut';
import type { TrackExternalIDOut } from './TrackExternalIDOut';
import type { TrackFieldOverrideEntry } from './TrackFieldOverrideEntry';
import type { TrackFieldSourceOut } from './TrackFieldSourceOut';
import type { TrackHostedAudioOut } from './TrackHostedAudioOut';
import type { TrackPlatformLinkOut } from './TrackPlatformLinkOut';
export type TrackOut = {
    /**
     * Artists is the M:N performer attachment list. NEVER nil on the wire.
     */
    artists?: Array<TrackArtistOut>;
    /**
     * ArtworkURL is the cover-art URL (provider CDN, hydrated from
     * SoundCloud - see field_sources). nil when unknown.
     */
    artwork_url?: string;
    /**
     * CanEdit is true when the authenticated viewer may modify this
     * track (steward - created_by_user_id - or platform admin).
     * Conservative: never a false-positive grant.
     */
    can_edit?: boolean;
    /**
     * ConsensusBest is the crowd-sourced best value per metadata
     * field (B9). Omitted when no observations exist.
     */
    consensus_best?: MetadataConsensusBestOut;
    /**
     * CreatedAt is the row creation timestamp (RFC3339 UTC).
     */
    created_at?: string;
    /**
     * CreatedByUserID is the user who first created or imported
     * the row. nil for system-created stubs.
     */
    created_by_user_id?: string;
    /**
     * DurationMS is the track length in milliseconds. nil when
     * unknown.
     */
    duration_ms?: number;
    /**
     * ExternalIDs is the cross-platform identifier list. NEVER nil on the wire.
     */
    external_ids?: Array<TrackExternalIDOut>;
    /**
     * FieldSources is the per-field provider back-reference list:
     * which provider + source row each hydrated field value came
     * from (e.g. {field:"duration_ms", provider:"soundcloud",
     * source_id:"123", fetched_at:...}). Powers per-field
     * "(sourced by <provider>)" badges. Omitted when no field was
     * provider-hydrated. Additive - pre-existing consumers ignore it.
     */
    field_sources?: Array<TrackFieldSourceOut>;
    /**
     * HostedAudio are the FIRST-PARTY recordings whose hosted audio
     * contains this track (F2). Rank #1 in the playback policy: prefer
     * these over every third-party provider in `external_ids` /
     * `platform_links`. NEVER nil - `[]` when we host nothing playable
     * for this track, or when the caller may not read any recording
     * that does. Visibility-gated per row (see TrackHostedAudioOut).
     */
    hosted_audio?: Array<TrackHostedAudioOut>;
    /**
     * ID is the canonical track row id.
     */
    id?: string;
    /**
     * IsCanonical is false for legacy / lazily-imported stubs
     * that should not be shown in user-facing search until
     * reviewed.
     */
    is_canonical?: boolean;
    /**
     * ISRC is the International Standard Recording Code when
     * supplied by a rightsholder or scraped from a provider.
     * nil when unknown.
     */
    isrc?: string;
    /**
     * MyRole is the viewer's coarse edit role. Null for anonymous
     * viewers and non-editors.
     */
    my_role?: 'owner' | 'editor' | 'collaborator' | 'viewer';
    /**
     * Overrides is the per-field artist hard-override list (W2b). When
     * a verified credited artist has overridden a field, the override
     * value is the displayed truth (source `artist-provided`) and the
     * matching `consensus_best` entry stays as secondary. Omitted when
     * no override exists. Additive - pre-W2b consumers ignore it.
     */
    overrides?: Array<TrackFieldOverrideEntry>;
    /**
     * ParentTrackID points at the original track when this row is
     * a remix / edit / VIP version. nil otherwise.
     */
    parent_track_id?: string;
    /**
     * PlatformLinks are per-recording platform stream/store links from
     * ListenBrainz Labs mappings + MusicBrainz url-relationships (task
     * #60). Complements external_ids (community-voted links): these are
     * dataset-derived, provenance-tagged, verified=false until platform
     * confirmation. Omitted when none. Additive - pre-#60 consumers
     * ignore it.
     */
    platform_links?: Array<TrackPlatformLinkOut>;
    /**
     * Relationship is the coarse viewer↔track relationship. Null for
     * anonymous viewers; "none" for an authenticated non-steward.
     */
    relationship?: 'steward' | 'none';
    /**
     * ReleaseDate is the first-known release date. nil when
     * unknown. Emitted in RFC3339 form when set `).
     */
    release_date?: string;
    /**
     * Source identifies where the row was first created from
     * (e.g. "soundcloud_cache_backfill", "tracklist_import",
     * "user_manual", "acoustid_match"). nil when unknown.
     */
    source?: string;
    /**
     * Title is the display title for the track. Required, non-empty.
     */
    title?: string;
    /**
     * UpdatedAt is the row last-modified timestamp (RFC3339 UTC).
     */
    updated_at?: string;
    /**
     * VersionLabel is the free-text version qualifier (e.g.
     * "Tiësto Remix", "VIP Mix", "Radio Edit"). nil for original
     * recordings - emitted as JSON `null`.
     */
    version_label?: string;
};

