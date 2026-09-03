/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserNotificationPrefsUpdate = {
    /**
     * Global pause
     */
    all_notifications_paused?: boolean;
    /**
     * Custom webhook secret (write-only)
     */
    custom_webhook_secret?: string;
    /**
     * Custom webhook URL
     */
    custom_webhook_url?: string;
    /**
     * Discord DM sub-channel switch
     */
    discord_dm_enabled?: boolean;
    /**
     * Discord channel switch
     */
    discord_enabled?: boolean;
    /**
     * Discord server sub-channel switch
     */
    discord_server_enabled?: boolean;
    /**
     * Discord webhook URL
     */
    discord_webhook_url?: string;
    /**
     * Email channel switch
     */
    email_enabled?: boolean;
    /**
     * Webhook channel switch
     */
    webhook_enabled?: boolean;
};

