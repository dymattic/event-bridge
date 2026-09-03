/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelInsightOut } from './ChannelInsightOut';
export type DiscordInsightsOut = {
    by_channel?: Array<ChannelInsightOut>;
    discord_dm_failed?: number;
    discord_dm_sent?: number;
    discord_server_failed?: number;
    discord_server_sent?: number;
    discord_webhook_failed?: number;
    discord_webhook_sent?: number;
    total_notifications?: number;
};

