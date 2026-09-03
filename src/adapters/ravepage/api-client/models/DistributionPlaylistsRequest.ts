/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DistributionPlatform } from './DistributionPlatform';
export type DistributionPlaylistsRequest = {
    /**
     * Limit - max playlists to return (1..50). 0 → server-default 25.
     */
    limit?: number;
    /**
     * PageToken - provider-specific pagination cursor.
     */
    page_token?: string;
    /**
     * Platform - target provider.
     */
    platform?: DistributionPlatform;
    /**
     * UserID - bare-UUID string of the actor.
     */
    user_id?: string;
};

