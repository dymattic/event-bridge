/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LibraryTrackOut } from './LibraryTrackOut';
export type LibraryListOut = {
    /**
     * Count is the number of rows in this page.
     */
    count?: number;
    /**
     * Limit applied to this page.
     */
    limit?: number;
    /**
     * Offset applied to this page.
     */
    offset?: number;
    /**
     * Total is the FULL filtered row count (ignores limit/offset) -
     * drives FE pagination.
     */
    total?: number;
    /**
     * Tracks is the page of the caller's library, newest first.
     */
    tracks?: Array<LibraryTrackOut>;
};

