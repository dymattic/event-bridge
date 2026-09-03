/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TracklistSoundCloudTrackOut = {
    /**
     * ArtworkURL is the artwork URL; null when not cached.
     */
    artwork_url?: string;
    /**
     * CreatedAt is the CACHE row insert time; null when not cached.
     */
    created_at?: string;
    /**
     * CustomArtworkURL overrides ArtworkURL; null when unset/uncached.
     */
    custom_artwork_url?: string;
    /**
     * CustomTitle overrides Title for display; null when unset/uncached.
     */
    custom_title?: string;
    /**
     * ID is the platform cache row UUID; null when not cached.
     */
    id?: string;
    /**
     * LinkedAt is when the link was asserted. Always present.
     */
    linked_at?: string;
    /**
     * PermalinkURL is the cached SoundCloud permalink; null when not
     * cached (use URL for a link that always works).
     */
    permalink_url?: string;
    /**
     * Title is the cached track title; null when not cached.
     */
    title?: string;
    /**
     * TrackID is the numeric SoundCloud track id. Always present - it
     * IS the link.
     */
    track_id?: number;
    /**
     * UpdatedAt is the CACHE row last-mutation time; null when not cached.
     */
    updated_at?: string;
    /**
     * URL is the canonical track URL: the captured permalink when
     * known, else the api.soundcloud.com resource form. Always present.
     */
    url?: string;
};

