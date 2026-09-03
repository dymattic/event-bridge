/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserNotificationPrefsResponse = {
    /**
     * Global pause
     */
    all_notifications_paused?: boolean;
    /**
     * ISO-8601 timestamp
     */
    created_at?: string;
    /**
     * Custom webhook URL
     */
    custom_webhook_url?: string;
    /**
     * Discord DM sub-channel switch
     */
    discord_dm_enabled?: boolean;
    /**
     * Discord channel master switch
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
     * Email channel master switch
     */
    email_enabled?: boolean;
    /**
     * Prefs row UUID
     */
    id?: string;
    /**
     * ISO-8601 timestamp
     */
    updated_at?: string;
    /**
     * Owning user UUID
     */
    user_id?: string;
    /**
     * Webhook channel master switch
     */
    webhook_enabled?: boolean;
};

