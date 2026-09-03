/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudCachedTrack } from './SoundCloudCachedTrack';
export type SoundCloudTrackCachePageResponse = {
    /**
     * HasMore - false when this is the last page.
     */
    has_more?: boolean;
    /**
     * NextAfterTrackID - cursor for the next page (last row's SC id).
     * 0 when the page is empty.
     */
    next_after_track_id?: number;
    /**
     * Tracks - page rows ordered by ascending SC track id. Non-nil
     * (empty → `[]`).
     */
    tracks?: Array<SoundCloudCachedTrack>;
};

