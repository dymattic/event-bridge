/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudUserProfileOut } from './SoundCloudUserProfileOut';
export type SoundCloudTrackCacheOut = {
    /**
     * SoundCloud streaming access level.
     */
    access?: 'playable' | 'preview' | 'blocked';
    /**
     * Artwork URL.
     */
    artwork_url?: string;
    /**
     * Cache write timestamp.
     */
    cached_at?: string;
    /**
     * SoundCloud-side creation date.
     */
    created_at?: string;
    /**
     * Custom artwork URL.
     */
    custom_artwork_url?: string;
    /**
     * Custom Rave.Page title.
     */
    custom_title?: string;
    /**
     * Description.
     */
    description?: string;
    /**
     * Duration in milliseconds.
     */
    duration?: number;
    /**
     * Genre.
     */
    genre?: string;
    /**
     * Cache row UUID.
     */
    id?: string;
    /**
     * Cache last-updated timestamp.
     */
    last_updated?: string;
    /**
     * Number of likes.
     */
    likes_count?: number;
    /**
     * Permalink URL.
     */
    permalink_url?: string;
    /**
     * Number of plays.
     */
    playback_count?: number;
    /**
     * Tags.
     */
    tag_list?: string;
    /**
     * Title.
     */
    title?: string;
    /**
     * SoundCloud track ID.
     */
    track_id?: number;
    /**
     * Linked tracklist UUIDs; non-nil slice.
     */
    tracklist_ids?: Array<string>;
    /**
     * Track owner (projected from cached raw_data["user"]); null when absent.
     */
    user?: SoundCloudUserProfileOut;
};

