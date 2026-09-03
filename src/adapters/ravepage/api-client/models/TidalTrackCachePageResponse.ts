/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TidalCachedTrack } from './TidalCachedTrack';
export type TidalTrackCachePageResponse = {
    /**
     * HasMore - false when this is the last page.
     */
    has_more?: boolean;
    /**
     * NextAfterTrackID - cursor for the next page. "" when empty.
     */
    next_after_track_id?: string;
    /**
     * Tracks - page rows ordered by ascending track id. Non-nil
     * (empty → `[]`).
     */
    tracks?: Array<TidalCachedTrack>;
};

