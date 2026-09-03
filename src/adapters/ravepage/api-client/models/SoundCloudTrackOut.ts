/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudUserProfileOut } from './SoundCloudUserProfileOut';
export type SoundCloudTrackOut = {
    /**
     * URL of the track artwork.
     */
    artwork_url?: string;
    /**
     * Creation date.
     */
    created_at?: string;
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
     * SoundCloud track ID.
     */
    id?: number;
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
     * Tags (space-separated).
     */
    tag_list?: string;
    /**
     * Title of the track.
     */
    title?: string;
    /**
     * User who uploaded the track.
     */
    user?: SoundCloudUserProfileOut;
};

