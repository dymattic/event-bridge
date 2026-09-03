/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EntitySettingsPatchIn = {
    /**
     * AllowedChannels - nil = skip; [] = clear allow-list; non-empty
     * = replace.
     */
    allowed_channels?: Array<string>;
    /**
     * DiscordWebhookURL - nil = skip; "" = clear; non-empty = set.
     */
    discord_webhook_url?: string;
};

