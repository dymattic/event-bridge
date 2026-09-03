/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TwitchVideoOut } from './TwitchVideoOut';
export type TwitchVideosOut = {
    /**
     * Videos; non-nil slice.
     */
    items?: Array<TwitchVideoOut>;
    /**
     * Pagination cursor.
     */
    next_cursor?: string;
};

