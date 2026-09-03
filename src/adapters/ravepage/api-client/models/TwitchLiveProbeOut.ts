/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TwitchLiveProbeOut = {
    /**
     * GameName - current game / category name.
     */
    game_name?: string;
    /**
     * IsLive - whether the broadcaster is currently live.
     */
    is_live?: boolean;
    /**
     * StartedAt - UTC stream start time (ISO 8601 string).
     */
    started_at?: string;
    /**
     * ThumbnailURL - stream thumbnail URL template (contains
     * `{width}x{height}` placeholders).
     */
    thumbnail_url?: string;
    /**
     * Title - current stream title.
     */
    title?: string;
    /**
     * TwitchDisplayName - Twitch display name (user_name in Helix).
     */
    twitch_display_name?: string;
    /**
     * TwitchLogin - Twitch login name.
     */
    twitch_login?: string;
    /**
     * ViewerCount - current viewer count.
     */
    viewer_count?: number;
};

