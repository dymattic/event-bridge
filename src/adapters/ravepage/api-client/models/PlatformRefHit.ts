/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudTrackLink } from './SoundCloudTrackLink';
import type { YouTubeVideoLink } from './YouTubeVideoLink';
export type PlatformRefHit = {
    /**
     * ExternalRef is the durable PLATFORM id (YT videoId / SC numeric
     * track id as a decimal string). Never a cache uuid.
     */
    external_ref?: string;
    /**
     * Provider echoes the query's provider.
     */
    provider?: string;
    /**
     * SoundCloud carries the cached display metadata; nil for YT hits.
     */
    soundcloud?: SoundCloudTrackLink;
    /**
     * URL is the canonical platform URL; "" when unknown.
     */
    url?: string;
    /**
     * YouTube carries the cached display metadata; nil for SC hits.
     */
    youtube?: YouTubeVideoLink;
};

