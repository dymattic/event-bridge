/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudStreamAttributionOut } from './SoundCloudStreamAttributionOut';
import type { SoundCloudTranscodingOut } from './SoundCloudTranscodingOut';
export type SoundCloudStreamOut = {
    /**
     * Access level.
     */
    access?: 'playable' | 'preview' | 'blocked';
    /**
     * SoundCloud-ToS attribution.
     */
    attribution?: SoundCloudStreamAttributionOut;
    /**
     * SoundCloud track ID.
     */
    track_id?: number;
    /**
     * Available transcodings; non-nil slice.
     */
    transcodings?: Array<SoundCloudTranscodingOut>;
};

