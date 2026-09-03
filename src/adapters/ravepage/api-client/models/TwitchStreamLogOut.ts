/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TwitchStreamLogOut = {
    /**
     * Log creation time.
     */
    created_at?: string;
    /**
     * Stream end time.
     */
    ended_at?: string;
    /**
     * Game/category name.
     */
    game_name?: string;
    /**
     * Log entry ID (UUID).
     */
    id?: string;
    /**
     * Stream language.
     */
    language?: string;
    /**
     * Stream start time.
     */
    started_at?: string;
    /**
     * Twitch stream ID.
     */
    stream_id?: string;
    /**
     * Stream tags.
     */
    tags?: Array<string>;
    /**
     * Stream title.
     */
    title?: string;
    /**
     * Average viewer count.
     */
    viewer_count_avg?: number;
    /**
     * Peak viewer count.
     */
    viewer_count_peak?: number;
};

