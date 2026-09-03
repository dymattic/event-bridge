/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DistributionPlatform } from './DistributionPlatform';
import type { DistributionPlaylist } from './DistributionPlaylist';
export type DistributionPlaylistsResponse = {
    next_page_token?: string;
    platform?: DistributionPlatform;
    playlists?: Array<DistributionPlaylist>;
    total_results?: number;
};

