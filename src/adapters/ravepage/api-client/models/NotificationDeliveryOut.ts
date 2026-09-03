/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NotificationDeliveryOut = {
    channel?: 'email' | 'discord' | 'discord_dm' | 'discord_server' | 'webhook';
    error_message?: string;
    id?: string;
    notification_id?: string;
    sent_at?: string;
    status?: 'pending' | 'sent' | 'failed';
};

