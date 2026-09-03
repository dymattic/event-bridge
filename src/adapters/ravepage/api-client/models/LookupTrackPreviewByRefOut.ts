/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LookupTrackPreviewByRefOut = {
    /**
     * ArtistNames are the credited performer names in position order.
     * Empty (never null) when no artists attached / hydration failed
     * soft producer-side.
     */
    artist_names?: Array<string>;
    /**
     * ArtworkURL is the absolute, anonymously-fetchable cover-art URL
     * (provider CDN hot-link). "" when unknown - composer falls back
     * to the synthetic /v1/og card.
     */
    artwork_url?: string;
    created_at?: string;
    /**
     * DurationMS is the track length in milliseconds (0 = unknown).
     */
    duration_ms?: number;
    /**
     * ReleaseDate is the first-known release date ("" = unknown).
     */
    release_date?: string;
    /**
     * Title is the track display title.
     */
    title?: string;
    /**
     * TrackID is the bare-UUID string of the matched tracks row.
     */
    track_id?: string;
    updated_at?: string;
    /**
     * VersionLabel is the free-text version qualifier ("" for
     * original recordings).
     */
    version_label?: string;
};

