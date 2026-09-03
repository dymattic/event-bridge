/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DiscordTargetCreate = {
    /**
     * ChannelLabel is a free-text label for the webhook destination.
     * 1..255 chars.
     */
    channel_label?: string;
    /**
     * OwnerID is the prefixed-or-bare UUID of the owning entity.
     */
    owner_id?: string;
    /**
     * OwnerType is one of "user","group","performer".
     */
    owner_type?: string;
    /**
     * WebhookURL is the Discord channel webhook. 1+ chars.
     */
    webhook_url?: string;
};

