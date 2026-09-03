/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SoundCloudArtistTrackOut = {
    /**
     * Streaming access level.
     */
    access?: 'playable' | 'preview' | 'blocked';
    /**
     * RAW sndcdn URL; prefer the cached /tracks/{id}/artwork endpoint.
     */
    artwork_url?: string;
    /**
     * shared/setmix verdict; null = unclassified.
     */
    catalog_class?: 'track' | 'set_mix';
    /**
     * SoundCloud-side creation date ("" when unknown).
     */
    created_at?: string;
    /**
     * Duration in ms.
     */
    duration?: number;
    /**
     * Genre.
     */
    genre?: string;
    /**
     * Likes.
     */
    likes_count?: number;
    /**
     * Track URL.
     */
    permalink_url?: string;
    /**
     * Plays.
     */
    playback_count?: number;
    /**
     * COALESCE(custom_title, title).
     */
    title?: string;
    /**
     * SoundCloud track id.
     */
    track_id?: number;
};

