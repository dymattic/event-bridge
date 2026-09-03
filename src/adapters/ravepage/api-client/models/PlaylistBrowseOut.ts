/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistOut } from './PlaylistOut';
export type PlaylistBrowseOut = {
    /**
     * Count of rows in this page.
     */
    count?: number;
    /**
     * Limit applied.
     */
    limit?: number;
    /**
     * Offset applied.
     */
    offset?: number;
    /**
     * Playlists page.
     */
    playlists?: Array<PlaylistOut>;
};

