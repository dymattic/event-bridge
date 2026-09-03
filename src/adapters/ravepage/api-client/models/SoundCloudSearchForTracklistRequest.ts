/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudSearchTracklistQuery } from './SoundCloudSearchTracklistQuery';
export type SoundCloudSearchForTracklistRequest = {
    /**
     * CallerUserID - bare UUID string of the tracklist member whose SC
     * OAuth token will be used. Required.
     */
    caller_user_id?: string;
    /**
     * LimitPerTrack - max SC suggestions per query (1-20). Tracks
     * clamps before sending; contract re-clamps defensively (defaults
     * to 5 on zero/negative, caps at 20).
     */
    limit_per_track?: number;
    /**
     * Queries - one entry per tracklist item, in tracklist order.
     * Empty `Query` strings are allowed; the contract emits an
     * `Error` row for them rather than calling SC.
     */
    queries?: Array<SoundCloudSearchTracklistQuery>;
};

