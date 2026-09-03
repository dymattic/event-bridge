/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type YouTubeTrackCachePageRequest = {
    /**
     * AfterVideoID - return rows with video_id strictly greater
     * (lexicographic). "" starts from the beginning.
     */
    after_video_id?: string;
    /**
     * Limit - max rows per page (1-500). Defaults to 200 on
     * zero/negative, caps at 500.
     */
    limit?: number;
};

