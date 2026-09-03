/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TwitchUserProfileOut = {
    /**
     * Broadcaster type (affiliate, partner, or empty).
     */
    broadcaster_type?: '' | 'affiliate' | 'partner';
    /**
     * Account creation date (ISO 8601).
     */
    created_at?: string;
    /**
     * Channel bio.
     */
    description?: string;
    /**
     * Display name.
     */
    display_name?: string;
    /**
     * User email (only with user:read:email scope).
     */
    email?: string;
    /**
     * Twitch user ID.
     */
    id?: string;
    /**
     * Twitch login name.
     */
    login?: string;
    /**
     * Offline image URL.
     */
    offline_image_url?: string;
    /**
     * Profile image URL.
     */
    profile_image_url?: string;
    /**
     * User type (staff, admin, global_mod, or empty).
     */
    type?: string;
    /**
     * Total view count (deprecated by Twitch).
     */
    view_count?: number;
};

