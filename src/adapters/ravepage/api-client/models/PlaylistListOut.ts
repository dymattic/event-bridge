/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistOut } from './PlaylistOut';
export type PlaylistListOut = {
    /**
     * Count of rows returned.
     */
    count?: number;
    /**
     * Playlists, owner's first (updated DESC), then shared.
     */
    playlists?: Array<PlaylistOut>;
};

