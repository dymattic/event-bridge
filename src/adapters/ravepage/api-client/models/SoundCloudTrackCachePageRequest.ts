/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SoundCloudTrackCachePageRequest = {
    /**
     * AfterTrackID - return rows with SC track_id strictly greater.
     * 0 starts from the beginning.
     */
    after_track_id?: number;
    /**
     * Limit - max rows per page (1-500). Defaults to 200 on
     * zero/negative, caps at 500.
     */
    limit?: number;
};

