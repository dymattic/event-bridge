/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SoundCloudCachedTrack = {
    /**
     * Artist - SC uploader username (soundcloud_user_cache join,
     * raw_data.user fallback).
     */
    artist?: string;
    /**
     * ArtistAvatarURL - uploader avatar (performer image_url seed).
     */
    artist_avatar_url?: string;
    artist_city?: string;
    artist_description?: string;
    artist_followers?: number;
    /**
     * ArtistFullName / ArtistCity / ArtistDescription / ArtistFollowers
     * - best-effort profile fields from soundcloud_user_cache (absent
     * on rows hydrated only from a track-embedded user block).
     */
    artist_full_name?: string;
    /**
     * ArtistID - SC numeric user id of the uploader (0 when unknown).
     * Additive 2026-06-13: performer-provisioning identity key
     * (performers.source='soundcloud', external_id=ArtistID).
     */
    artist_id?: number;
    /**
     * ArtistPermalinkURL - SC profile URL of the uploader.
     */
    artist_permalink_url?: string;
    /**
     * ArtworkURL - cover (custom wins). Optional.
     */
    artwork_url?: string;
    /**
     * DurationMS - cached duration in ms (0 when unknown).
     */
    duration_ms?: number;
    /**
     * FetchedAt - when the cache row was last refreshed from SC
     * (RFC3339 UTC; soundcloud_tracks.last_updated). Becomes the
     * per-field provenance fetched_at on the tracks side.
     */
    fetched_at?: string;
    /**
     * Genre - SC genre string. Optional.
     */
    genre?: string;
    /**
     * IsSetMix - true when the row is a DJ set / mix / podcast (the
     * hydration sweep skips it).
     */
    is_set_mix?: boolean;
    /**
     * PermalinkURL - SC canonical link.
     */
    permalink_url?: string;
    /**
     * SetMixReason - "duration_gt_20m" | "keyword:<kw>" | "" (single
     * track). Same value persisted on the cache row for inspection.
     */
    set_mix_reason?: string;
    /**
     * TagList - raw SC tag_list (space-separated, quoted multi-word).
     */
    tag_list?: string;
    /**
     * Title - display title (custom_title wins over the SC title).
     */
    title?: string;
    /**
     * TrackID - SC numeric track id (the provider_track_id key).
     */
    track_id?: number;
};

