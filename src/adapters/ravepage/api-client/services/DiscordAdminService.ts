/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BotGuildsOut } from '../models/BotGuildsOut';
import type { DiscordMetricsSummaryOut } from '../models/DiscordMetricsSummaryOut';
import type { DMDailyOut } from '../models/DMDailyOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiscordAdminService {
    /**
     * Admin - per-day Discord channel-message delivery counts
     * Returns per-day sent/failed/pending counts for channel-messages the bot posted into guild text channels, over a trailing window. Caller MUST carry the `admin` role on the gateway-minted internal claim; non-admin returns 403.
     * @returns DMDailyOut OK
     * @throws ApiError
     */
    public static adminDiscordChannelDaily({
        days,
    }: {
        /**
         * Trailing window in days (1..365, default 30)
         */
        days?: any,
    }): CancelablePromise<DMDailyOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/admin/metrics/channel-daily',
            query: {
                'days': days,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid days parameter`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Admin - per-day Discord DM delivery counts
     * Returns per-day sent/failed/pending counts for Discord DMs across all users, over a trailing window. Caller MUST carry the `admin` role on the gateway-minted internal claim; non-admin returns 403.
     * @returns DMDailyOut OK
     * @throws ApiError
     */
    public static adminDiscordDmDaily({
        days,
    }: {
        /**
         * Trailing window in days (1..365, default 30)
         */
        days?: any,
    }): CancelablePromise<DMDailyOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/admin/metrics/dm-daily',
            query: {
                'days': days,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid days parameter`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Admin - list guilds the bot is in
     * Returns up to 200 guilds the Discord bot is currently a member of. Sorted by guild name (case-insensitive). Requires `admin` role on the gateway-minted internal claim.
     * @returns BotGuildsOut OK
     * @throws ApiError
     */
    public static adminDiscordBotGuilds(): CancelablePromise<BotGuildsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/admin/metrics/guilds',
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                502: `Discord upstream failure`,
                503: `Discord bot token not configured`,
            },
        });
    }
    /**
     * Admin - Discord delivery + bot-presence summary
     * Returns the bot's current guild count + total DM and channel-message delivery counts (sent/failed/pending). Pass `?days=N` (1..365) to restrict totals to a trailing window; omit for all-time. Requires `admin` role.
     * @returns DiscordMetricsSummaryOut OK
     * @throws ApiError
     */
    public static adminDiscordMetricsSummary({
        days,
    }: {
        /**
         * Restrict totals to last N days (1..365); omit for all-time.
         */
        days?: any,
    }): CancelablePromise<DiscordMetricsSummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/admin/metrics/summary',
            query: {
                'days': days,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid days`,
                500: `Internal error`,
            },
        });
    }
}
