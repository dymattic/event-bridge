/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TidalCachedTrack = {
    /**
     * Artist - artist display name. Metadata ONLY - NO performer
     * minting from TIDAL artists (entity-resolution rework semantics).
     */
    artist?: string;
    /**
     * ArtistHandle - TIDAL @handle of the artist.
     */
    artist_handle?: string;
    /**
     * ArtistTidalID - TIDAL artist id of the catalog owner ("" unknown).
     */
    artist_tidal_id?: string;
    /**
     * ArtworkURL - cover art (custom wins). Optional.
     */
    artwork_url?: string;
    /**
     * BPM - TIDAL-served tempo (0 unknown).
     */
    bpm?: number;
    /**
     * DurationMS - duration in ms parsed from the ISO-8601 cache value
     * (0 when unknown).
     */
    duration_ms?: number;
    /**
     * FetchedAt - cache row last_updated (RFC3339 UTC). Becomes the
     * per-field provenance fetched_at on the tracks side.
     */
    fetched_at?: string;
    /**
     * IsSetMix - true when the row is a DJ set / mix.
     */
    is_set_mix?: boolean;
    /**
     * ISRC - International Standard Recording Code ("" unknown).
     * Strong cross-provider matching signal.
     */
    isrc?: string;
    key_scale?: string;
    /**
     * MusicalKey / KeyScale - TIDAL-served key ("" unknown).
     */
    musical_key?: string;
    /**
     * PermalinkURL - tidal.com listen URL.
     */
    permalink_url?: string;
    /**
     * SetMixReason - "duration_gt_20m" | "keyword:<kw>" | "".
     */
    set_mix_reason?: string;
    /**
     * Title - display title (custom_title wins).
     */
    title?: string;
    /**
     * ToneTags - space-joined toneTags (setmix keyword surface).
     */
    tone_tags?: string;
    /**
     * TrackID - TIDAL track id (the provider_track_id key).
     */
    track_id?: string;
};

