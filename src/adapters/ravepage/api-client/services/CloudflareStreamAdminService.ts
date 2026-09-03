/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminStorageUsageOut } from '../models/AdminStorageUsageOut';
import type { LiveInputDetailOut } from '../models/LiveInputDetailOut';
import type { LiveInputListOut } from '../models/LiveInputListOut';
import type { StreamVodListOut } from '../models/StreamVodListOut';
import type { UserStreamingCostSummaryOut } from '../models/UserStreamingCostSummaryOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CloudflareStreamAdminService {
    /**
     * Admin - get the full billing summary for any user
     * Returns combined Cloudflare Stream + Hetzner cost breakdown for the named user. Requires admin role.
     * @returns UserStreamingCostSummaryOut OK
     * @throws ApiError
     */
    public static getAdminCloudflareStreamBilling({
        userId,
    }: {
        /**
         * Target user UUID
         */
        userId: any,
    }): CancelablePromise<UserStreamingCostSummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cloudflare-stream/billing/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid user_id`,
                500: `Billing aggregation failed`,
            },
        });
    }
    /**
     * Admin - list all Cloudflare Stream live inputs
     * Lists live inputs across all users. Requires admin role on the gateway-minted internal claim.
     * @returns LiveInputListOut OK
     * @throws ApiError
     */
    public static listAdminCloudflareStreamLiveInputs({
        limit,
        cursor,
    }: {
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * ISO-8601 created_at cursor
         */
        cursor?: any,
    }): CancelablePromise<LiveInputListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cloudflare-stream/live-inputs',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid query parameter`,
            },
        });
    }
    /**
     * Admin - delete any live input
     * Removes the live input on Cloudflare and locally regardless of owner. Requires admin role on the gateway-minted internal claim.
     * @returns void
     * @throws ApiError
     */
    public static deleteAdminCloudflareStreamLiveInput({
        liveInputId,
    }: {
        /**
         * Live input ID
         */
        liveInputId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cloudflare-stream/live-inputs/{live_input_id}',
            path: {
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Live input not found`,
                422: `Invalid live_input_id`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
    /**
     * Admin - get a live input by id
     * Fetches one live input without user-scoping. Requires admin role.
     * @returns LiveInputDetailOut OK
     * @throws ApiError
     */
    public static getAdminCloudflareStreamLiveInput({
        liveInputId,
    }: {
        /**
         * Live input ID
         */
        liveInputId: any,
    }): CancelablePromise<LiveInputDetailOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cloudflare-stream/live-inputs/{live_input_id}',
            path: {
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Live input not found`,
                422: `Invalid live_input_id`,
            },
        });
    }
    /**
     * Admin - account-level Cloudflare Stream storage usage
     * Returns total stored minutes + video count from the Cloudflare account storage endpoint. Requires admin role.
     * @returns AdminStorageUsageOut OK
     * @throws ApiError
     */
    public static listAdminCloudflareStreamStorage(): CancelablePromise<AdminStorageUsageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cloudflare-stream/storage',
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
    /**
     * Admin - list all VOD recordings
     * Returns VOD recordings across ALL users. Requires the caller to carry the `admin` role on the gateway-minted internal claim. Non-admin → 403.
     * @returns StreamVodListOut OK
     * @throws ApiError
     */
    public static listAdminCloudflareStreamVods({
        limit,
        cursor,
    }: {
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * ISO-8601 created_at cursor from a prior response
         */
        cursor?: any,
    }): CancelablePromise<StreamVodListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cloudflare-stream/vods',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid query parameter`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Admin - delete any VOD
     * Removes the VOD on Cloudflare and locally regardless of owner. Requires admin role.
     * @returns void
     * @throws ApiError
     */
    public static deleteAdminCloudflareStreamVod({
        vodId,
    }: {
        /**
         * VOD ID
         */
        vodId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cloudflare-stream/vods/{vod_id}',
            path: {
                'vod_id': vodId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `VOD not found`,
                422: `Invalid vod_id`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
}
