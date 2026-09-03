/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileSocialAccount = {
    /**
     * Handle - public handle / username.
     */
    handle?: string;
    /**
     * IsLive - true when a live stream is active on this provider.
     */
    is_live?: boolean;
    /**
     * LiveURL - live-stream URL when is_live is true.
     */
    live_url?: string;
    /**
     * ProfileURL - canonical public URL on the provider.
     */
    profile_url?: string;
    /**
     * Provider slug.
     */
    provider?: 'x' | 'bluesky' | 'instagram' | 'youtube' | 'soundcloud' | 'twitch';
    /**
     * ResolvedFrom - "self" (linked on this entity) or "parent"
     * (cascaded from a parent entity).
     */
    resolved_from?: 'self' | 'parent';
};

