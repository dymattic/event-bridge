/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EPKMediaItem = {
    /**
     * Embed is optional provider-specific embed metadata.
     */
    embed?: Record<string, any>;
    /**
     * Platform is the source platform (e.g. "youtube").
     */
    platform?: 'youtube' | 'soundcloud' | 'bluesky' | 'twitch' | 'x' | 'instagram' | 'spotify';
    /**
     * Title is the display title.
     */
    title?: string;
    /**
     * URL is the public URL.
     */
    url?: string;
};

