/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudGenreFamily } from './SoundCloudGenreFamily';
export type SoundCloudArtistProfileOut = {
    /**
     * RAW sndcdn URL; prefer the cached /users/{id}/avatar endpoint.
     */
    avatar_url?: string;
    /**
     * City.
     */
    city?: string;
    /**
     * Country.
     */
    country?: string;
    /**
     * Bio.
     */
    description?: string;
    /**
     * Followers.
     */
    followers_count?: number;
    /**
     * Followings.
     */
    followings_count?: number;
    /**
     * Full name.
     */
    full_name?: string;
    /**
     * Genres is the derived genre families (count-desc, capped at 5) of
     * the artist's cached uploads. Additive; non-nil (empty array).
     */
    genres?: Array<SoundCloudGenreFamily>;
    /**
     * Cache last-updated timestamp.
     */
    last_updated?: string;
    /**
     * Profile URL.
     */
    permalink_url?: string;
    /**
     * Playlist count.
     */
    playlist_count?: number;
    /**
     * SoundCloud numeric user id.
     */
    soundcloud_id?: number;
    /**
     * Track count.
     */
    track_count?: number;
    /**
     * Display username.
     */
    username?: string;
};

