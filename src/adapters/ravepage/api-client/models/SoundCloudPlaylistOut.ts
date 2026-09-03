/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudTrackOut } from './SoundCloudTrackOut';
import type { SoundCloudUserProfileOut } from './SoundCloudUserProfileOut';
export type SoundCloudPlaylistOut = {
    /**
     * URL of the playlist artwork.
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
     * Playlist ID.
     */
    id?: number;
    /**
     * Permalink URL.
     */
    permalink_url?: string;
    /**
     * Title.
     */
    title?: string;
    /**
     * Number of tracks.
     */
    track_count?: number;
    /**
     * Tracks in the playlist.
     */
    tracks?: Array<SoundCloudTrackOut>;
    /**
     * User who created the playlist.
     */
    user?: SoundCloudUserProfileOut;
};

