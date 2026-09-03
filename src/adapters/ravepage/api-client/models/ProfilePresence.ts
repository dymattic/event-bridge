/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfilePresence = {
    /**
     * IsLive is true when the owner is actively streaming on any
     * linked platform.
     */
    is_live?: boolean;
    /**
     * LastActiveAt is the most recent activity timestamp across
     * linked platforms.
     */
    last_active_at?: string;
    /**
     * LiveOn is the first platform observed live; null when not live.
     */
    live_on?: 'twitch' | 'youtube' | 'vrchat' | 'cf_stream';
    /**
     * StreamEmbed is an opaque embed payload the FE can drop into a
     * player (e.g. {provider, channel, url}). Null when not live.
     */
    stream_embed?: Record<string, any>;
};

