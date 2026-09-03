/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EntitySettingsOut = {
    /**
     * AllowedChannels - allowed delivery channels (email|discord|
     * webhook|...). Empty slice when row exists but no channels
     * restricted.
     */
    allowed_channels?: Array<string>;
    /**
     * CreatedAt - ISO-8601.
     */
    created_at?: string;
    /**
     * DiscordWebhookURL - optional per-entity Discord webhook.
     * nil = unset.
     */
    discord_webhook_url?: string;
    /**
     * EntityID - entity UUID (bare).
     */
    entity_id?: string;
    /**
     * EntityType - entity scope (event|group|user|label|...).
     */
    entity_type?: string;
    /**
     * ID - row UUID.
     */
    id?: string;
    /**
     * UpdatedAt - ISO-8601.
     */
    updated_at?: string;
};

