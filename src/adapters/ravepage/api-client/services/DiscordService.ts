/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GuildInstallListOut } from '../models/GuildInstallListOut';
import type { GuildInstallResponseOut } from '../models/GuildInstallResponseOut';
import type { InviteURLOut } from '../models/InviteURLOut';
import type { PermissionCheckResponseOut } from '../models/PermissionCheckResponseOut';
import type { SendBookingDMRequest } from '../models/SendBookingDMRequest';
import type { SendBookingDMResponse } from '../models/SendBookingDMResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiscordService {
    /**
     * Discord bot install URL for the app directory
     * Returns an OAuth2 install URL for the user's personal app directory. The bot is installed to the user's app directory, not a specific guild; the user can then add it to any guild. Requires a linked Discord OAuth account.
     * @returns GuildInstallResponseOut OK
     * @throws ApiError
     */
    public static getDiscordBotAppDirectoryInstallLink(): CancelablePromise<GuildInstallResponseOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/app-directory',
            errors: {
                400: `DISCORD_NOT_LINKED`,
                401: `Authentication required or DISCORD_TOKEN_EXPIRED`,
                502: `Discord upstream failure`,
                503: `Discord client_id not configured`,
            },
        });
    }
    /**
     * Send booking-request DM via Discord
     * Sends an existing booking request to a Discord user as a
     * bot DM. The caller must be the booking's requester (or
     * target); the request is summarised into an embed and
     * delivered via the Discord bot. The delivery outcome is
     * recorded in the DM audit log. Returns the
     * `SendBookingDMResponse` with `success`, `delivery_id`,
     * and an optional `error` when the send did not complete.
     * @returns SendBookingDMResponse OK
     * @throws ApiError
     */
    public static sendBookingRequestDiscordDm({
        requestBody,
    }: {
        /**
         * Booking ID + target Discord user ID
         */
        requestBody: SendBookingDMRequest,
    }): CancelablePromise<SendBookingDMResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discord/bookings/send-request',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / bad UUID / bad discord ID`,
                401: `Authentication required`,
                404: `Booking not visible to caller`,
                502: `Upstream events worker unavailable`,
                503: `Booking-request client unconfigured (dev)`,
            },
        });
    }
    /**
     * List manageable Discord guilds
     * Returns guilds the authenticated caller can manage on Discord (ADMINISTRATOR or MANAGE_GUILD permission). Each item carries an `install_url` for inviting the bot; empty when the bot is already in the guild. Requires a linked Discord OAuth account.
     * @returns GuildInstallListOut OK
     * @throws ApiError
     */
    public static listDiscordBotGuilds({
        limit,
        cursor,
    }: {
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Opaque pagination cursor from a previous response
         */
        cursor?: any,
    }): CancelablePromise<GuildInstallListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/guilds',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                400: `DISCORD_NOT_LINKED or BAD_CURSOR`,
                401: `Authentication required or DISCORD_TOKEN_EXPIRED`,
                502: `Discord upstream failure`,
                503: `Discord client_id not configured`,
            },
        });
    }
    /**
     * Discord bot install URL for a specific guild
     * Returns an OAuth2 install URL for a guild the caller can manage. 404 when the guild is not in the caller's manageable list (BOLA-safe - does not reveal whether the guild exists).
     * @returns GuildInstallResponseOut OK
     * @throws ApiError
     */
    public static getDiscordBotInstallLinkForGuild({
        guildId,
    }: {
        /**
         * Discord guild snowflake id
         */
        guildId: any,
    }): CancelablePromise<GuildInstallResponseOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/install/{guild_id}',
            path: {
                'guild_id': guildId,
            },
            errors: {
                400: `DISCORD_NOT_LINKED`,
                401: `Authentication required or DISCORD_TOKEN_EXPIRED`,
                404: `Guild not found or not manageable`,
                502: `Discord upstream failure`,
                503: `Discord client_id not configured`,
            },
        });
    }
    /**
     * Public - Discord bot OAuth2 invite URL
     * Returns an OAuth2 URL with recommended permissions (VIEW_CHANNEL, SEND_MESSAGES, EMBED_LINKS, ATTACH_FILES) for inviting the bot to a guild. Public by design ; no authentication required.
     * @returns InviteURLOut OK
     * @throws ApiError
     */
    public static getDiscordBotInviteUrl({
        guildId,
    }: {
        /**
         * Optional guild ID to preselect in the onboarding dialog
         */
        guildId?: any,
    }): CancelablePromise<InviteURLOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/invite-url',
            query: {
                'guild_id': guildId,
            },
            errors: {
                503: `Discord client_id not configured`,
            },
        });
    }
    /**
     * Check bot permissions for your configured server channels
     * For each of your saved DiscordBotChannelConfig entries, return the missing permissions if any. Each row is independently checked; per-row failures surface as `missing: ["UNKNOWN_ERROR"]`.
     * @returns PermissionCheckResponseOut OK
     * @throws ApiError
     */
    public static checkDiscordBotPermissionsForConfigs(): CancelablePromise<PermissionCheckResponseOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/permissions/server-configs',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
                503: `Discord bot token not configured`,
            },
        });
    }
}
