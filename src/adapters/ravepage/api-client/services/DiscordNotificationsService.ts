/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiscordConfigCreateIn } from '../models/DiscordConfigCreateIn';
import type { DiscordConfigOut } from '../models/DiscordConfigOut';
import type { DiscordConfigPatchIn } from '../models/DiscordConfigPatchIn';
import type { DiscordInsightsOut } from '../models/DiscordInsightsOut';
import type { DiscordTestDMOut } from '../models/DiscordTestDMOut';
import type { DiscordTestServerOut } from '../models/DiscordTestServerOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiscordNotificationsService {
    /**
     * Discord notification insights
     * Returns per-channel rollup of Discord notification delivery stats for the caller.
     * @returns DiscordInsightsOut OK
     * @throws ApiError
     */
    public static getDiscordNotificationInsights(): CancelablePromise<DiscordInsightsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/notifications/insights',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * List Discord server configs
     * Returns the caller's Discord server-channel configs.
     * @returns DiscordConfigOut OK
     * @throws ApiError
     */
    public static listDiscordServerConfigs(): CancelablePromise<Array<DiscordConfigOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/notifications/server-configs',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Create Discord server config
     * Creates a Discord server-channel config row for the caller.
     * @returns DiscordConfigOut Created
     * @throws ApiError
     */
    public static createDiscordServerConfig({
        requestBody,
    }: {
        /**
         * Config payload
         */
        requestBody: DiscordConfigCreateIn,
    }): CancelablePromise<DiscordConfigOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discord/notifications/server-configs',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Delete Discord server config
     * Removes a Discord server-channel config.
     * @returns void
     * @throws ApiError
     */
    public static deleteDiscordServerConfig({
        configId,
    }: {
        /**
         * Config ID
         */
        configId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/discord/notifications/server-configs/{config_id}',
            path: {
                'config_id': configId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Config not found`,
            },
        });
    }
    /**
     * Patch Discord server config
     * Patches an existing config row.
     * @returns DiscordConfigOut OK
     * @throws ApiError
     */
    public static updateDiscordServerConfig({
        configId,
        requestBody,
    }: {
        /**
         * Config ID
         */
        configId: any,
        /**
         * Patch payload
         */
        requestBody: DiscordConfigPatchIn,
    }): CancelablePromise<DiscordConfigOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/discord/notifications/server-configs/{config_id}',
            path: {
                'config_id': configId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Config not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Send Discord test DM
     * Sends a test DM to the caller's linked Discord account.
     * @returns DiscordTestDMOut OK
     * @throws ApiError
     */
    public static sendTestDiscordDm(): CancelablePromise<DiscordTestDMOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discord/notifications/test-dm',
            errors: {
                401: `Unauthorized`,
                404: `No Discord link`,
                503: `Bot unavailable`,
            },
        });
    }
    /**
     * Send Discord test-server message
     * Sends a test message to the configured server channel.
     * @returns DiscordTestServerOut OK
     * @throws ApiError
     */
    public static testDiscordServerChannel({
        configId,
    }: {
        /**
         * Config ID
         */
        configId: any,
    }): CancelablePromise<DiscordTestServerOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discord/notifications/test-server/{config_id}',
            path: {
                'config_id': configId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Config not found`,
                503: `Bot unavailable`,
            },
        });
    }
}
