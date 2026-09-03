/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TidalTrackCachePageRequest = {
    /**
     * AfterTrackID - return rows with tidal_track_id strictly greater
     * (lexicographic). "" starts from the beginning.
     */
    after_track_id?: string;
    /**
     * Limit - max rows per page (1-500). Defaults to 200 on
     * zero/negative, caps at 500.
     */
    limit?: number;
};

