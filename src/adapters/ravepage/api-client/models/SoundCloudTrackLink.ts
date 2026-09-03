/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SoundCloudTrackLink = {
    /**
     * ArtworkURL is the artwork URL; nil when unset OR ToU-withheld.
     */
    artwork_url?: string;
    /**
     * CreatedAt is the cache row insert time.
     */
    created_at?: string;
    /**
     * CustomArtworkURL overrides ArtworkURL; nil when unset OR
     * ToU-withheld.
     */
    custom_artwork_url?: string;
    /**
     * CustomTitle overrides Title for display; nil when unset OR
     * ToU-withheld.
     */
    custom_title?: string;
    /**
     * ID is the cache row UUID.
     */
    id?: string;
    /**
     * PermalinkURL is the direct SoundCloud track URL; nil when unset
     * OR the artist is unlinked (ToU). Callers synthesize
     * `https://api.soundcloud.com/tracks/{track_id}` instead.
     */
    permalink_url?: string;
    /**
     * Title is the track title; nil when the cache row has none OR the
     * artist is unlinked (ToU).
     */
    title?: string;
    /**
     * TrackID is the numeric SoundCloud track id.
     */
    track_id?: number;
    /**
     * UpdatedAt is the cache row last-mutation time.
     */
    updated_at?: string;
};

