/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReleaseSoundCloudTrackOut = {
    /**
     * ArtworkURL is the artwork URL; null when unset.
     */
    artwork_url?: string;
    /**
     * CreatedAt is the cache row insert time.
     */
    created_at?: string;
    /**
     * CustomArtworkURL overrides ArtworkURL; null when unset.
     */
    custom_artwork_url?: string;
    /**
     * CustomTitle overrides Title for display; null when unset.
     */
    custom_title?: string;
    /**
     * ID is the cache row UUID.
     */
    id?: string;
    /**
     * PermalinkURL is the direct SoundCloud URL; null when unset.
     */
    permalink_url?: string;
    /**
     * Title is the cached track title; null when unknown.
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

