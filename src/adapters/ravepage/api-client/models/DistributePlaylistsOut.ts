/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DistributePlaylistOut } from './DistributePlaylistOut';
export type DistributePlaylistsOut = {
    next_page_token?: string;
    platform?: 'youtube' | 'soundcloud' | 'bluesky' | 'twitch' | 'x' | 'instagram' | 'spotify';
    playlists?: Array<DistributePlaylistOut>;
    total_results?: number;
};

