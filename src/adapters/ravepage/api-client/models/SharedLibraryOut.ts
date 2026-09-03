/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LibraryTrackOut } from './LibraryTrackOut';
export type SharedLibraryOut = {
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
     * OwnerUserID whose library is being read.
     */
    owner_user_id?: string;
    /**
     * Tracks page (full library projection incl. tags/cues/beatgrid -
     * the point of sharing; local file paths were never stored).
     */
    tracks?: Array<LibraryTrackOut>;
};

