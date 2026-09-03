/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudTrackLink } from './SoundCloudTrackLink';
import type { YouTubeVideoLink } from './YouTubeVideoLink';
export type ReleaseLinks = {
    /**
     * SoundCloudTracks linked to the release. Never null.
     */
    soundcloud_tracks?: Array<SoundCloudTrackLink>;
    /**
     * YouTubeVideos linked to the release. Never null.
     */
    youtube_videos?: Array<YouTubeVideoLink>;
};

