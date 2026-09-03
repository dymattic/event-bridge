/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudSuggestedLink } from './SoundCloudSuggestedLink';
export type SoundCloudSearchSuggestion = {
    /**
     * Artist - SC `user.username` (best-effort; may be empty on
     * malformed SC payloads).
     */
    artist?: string;
    /**
     * ArtworkURL - SC `artwork_url`. Optional.
     */
    artwork_url?: string;
    /**
     * Description - SC `description`. Optional.
     */
    description?: string;
    /**
     * Duration - SC `duration` in milliseconds. 0 when SC omits it.
     */
    duration?: number;
    /**
     * LikesCount - SC `likes_count`. 0 when absent.
     */
    likes_count?: number;
    /**
     * PermalinkURL - SC `permalink_url`.
     */
    permalink_url?: string;
    /**
     * PlaybackCount - SC `playback_count`. 0 when absent.
     */
    playback_count?: number;
    /**
     * SoundcloudID - raw numeric SC track id (e.g. 2093858931).
     */
    soundcloud_id?: number;
    /**
     * SuggestedLink - pre-formatted TrackLinkCreate-shaped payload
     * the caller can persist as-is.
     */
    suggested_link?: SoundCloudSuggestedLink;
    /**
     * Title - SC track title (e.g. "Awesome Track (Original Mix)").
     */
    title?: string;
};

