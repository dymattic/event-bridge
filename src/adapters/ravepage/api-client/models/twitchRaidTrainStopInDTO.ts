/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * One stop in a raid-train create payload.
 */
export type twitchRaidTrainStopInDTO = {
    /**
     * Order position (1-indexed).
     */
    position?: number;
    /**
     * Optional display name.
     */
    twitch_display_name?: string;
    /**
     * Twitch login.
     */
    twitch_login?: string;
    /**
     * Twitch user ID for this stop (numeric string).
     */
    twitch_user_id?: string;
};

