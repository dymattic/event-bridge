/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TwitchStreamInfoOut = {
    /**
     * Game/category ID.
     */
    game_id?: string;
    /**
     * Game/category name.
     */
    game_name?: string;
    /**
     * Stream ID.
     */
    id?: string;
    /**
     * Mature content flag.
     */
    is_mature?: boolean;
    /**
     * Stream language.
     */
    language?: string;
    /**
     * UTC start time.
     */
    started_at?: string;
    /**
     * Stream tags.
     */
    tags?: Array<string>;
    /**
     * Thumbnail URL template.
     */
    thumbnail_url?: string;
    /**
     * Stream title.
     */
    title?: string;
    /**
     * Stream type (live or empty).
     */
    type?: '' | 'live';
    /**
     * Broadcaster's user ID.
     */
    user_id?: string;
    /**
     * Broadcaster login.
     */
    user_login?: string;
    /**
     * Broadcaster display name.
     */
    user_name?: string;
    /**
     * Current viewer count.
     */
    viewer_count?: number;
};

