/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SoundCloudTrackCacheByIDsRequest = {
    /**
     * TrackIDs - SC numeric track ids to resolve (1-500; over-cap
     * requests are truncated producer-side). Order is not significant;
     * the response is keyed by TrackID.
     */
    track_ids?: Array<number>;
};

