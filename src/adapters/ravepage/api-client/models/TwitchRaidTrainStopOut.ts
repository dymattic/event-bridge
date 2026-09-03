/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TwitchRaidTrainStopOut = {
    /**
     * Stop ID (bare UUID - no prefix in
     */
    id?: string;
    /**
     * Order position.
     */
    position?: number;
    /**
     * When the raid to this stop was executed.
     */
    raided_at?: string;
    /**
     * Stop status.
     */
    status?: 'pending' | 'raided' | 'skipped';
    /**
     * Display name.
     */
    twitch_display_name?: string;
    /**
     * Twitch login.
     */
    twitch_login?: string;
    /**
     * Twitch user ID.
     */
    twitch_user_id?: string;
};

