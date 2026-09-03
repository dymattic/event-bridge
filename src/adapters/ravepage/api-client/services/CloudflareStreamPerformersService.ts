/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LiveInputCreateIn } from '../models/LiveInputCreateIn';
import type { LiveInputDetailOut } from '../models/LiveInputDetailOut';
import type { LiveInputListOut } from '../models/LiveInputListOut';
import type { SimulcastOutputCreateIn } from '../models/SimulcastOutputCreateIn';
import type { SimulcastOutputListOut } from '../models/SimulcastOutputListOut';
import type { SimulcastOutputOut } from '../models/SimulcastOutputOut';
import type { StreamVodListOut } from '../models/StreamVodListOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CloudflareStreamPerformersService {
    /**
     * List a performer's live inputs
     * Lists Cloudflare Stream live inputs scoped to a performer the caller owns.
     * @returns LiveInputListOut OK
     * @throws ApiError
     */
    public static listCloudflareStreamPerformerLiveInputs({
        performerId,
        limit,
        cursor,
    }: {
        /**
         * Performer ID
         */
        performerId: any,
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
            url: '/cloudflare-stream/performers/{performer_id}/live-inputs',
            path: {
                'performer_id': performerId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer not found`,
                422: `Invalid performer_id`,
                502: `Performer-owner upstream failure`,
            },
        });
    }
    /**
     * Create a live input scoped to a performer
     * Provisions a Cloudflare Stream live input owned by a performer the caller controls.
     * @returns LiveInputDetailOut Created
     * @throws ApiError
     */
    public static createCloudflareStreamPerformerLiveInput({
        performerId,
        requestBody,
    }: {
        /**
         * Performer ID
         */
        performerId: any,
        /**
         * Live-input create payload
         */
        requestBody: LiveInputCreateIn,
    }): CancelablePromise<LiveInputDetailOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cloudflare-stream/performers/{performer_id}/live-inputs',
            path: {
                'performer_id': performerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Performer not found`,
                422: `Validation failed`,
                502: `Cloudflare or performer-owner upstream failure`,
            },
        });
    }
    /**
     * Get a performer's live input
     * Fetches a single live input scoped to a performer the caller owns.
     * @returns LiveInputDetailOut OK
     * @throws ApiError
     */
    public static getCloudflareStreamPerformerLiveInput({
        performerId,
        liveInputId,
    }: {
        /**
         * Performer ID
         */
        performerId: any,
        /**
         * Live input ID
         */
        liveInputId: any,
    }): CancelablePromise<LiveInputDetailOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/performers/{performer_id}/live-inputs/{live_input_id}',
            path: {
                'performer_id': performerId,
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer or live input not found`,
                422: `Invalid IDs`,
                502: `Performer-owner upstream failure`,
            },
        });
    }
    /**
     * List simulcast outputs for a performer's live input
     * Returns the simulcast outputs configured on a performer's live input.
     * @returns SimulcastOutputListOut OK
     * @throws ApiError
     */
    public static listCloudflareStreamPerformerLiveInputOutputs({
        performerId,
        liveInputId,
    }: {
        /**
         * Performer ID
         */
        performerId: any,
        /**
         * Live input ID
         */
        liveInputId: any,
    }): CancelablePromise<SimulcastOutputListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/performers/{performer_id}/live-inputs/{live_input_id}/outputs',
            path: {
                'performer_id': performerId,
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer not found`,
                422: `Invalid IDs`,
                502: `Performer-owner upstream failure`,
            },
        });
    }
    /**
     * Add a simulcast output for a performer
     * Attaches a simulcast output to a performer's live input. Stream key is encrypted at rest.
     * @returns SimulcastOutputOut Created
     * @throws ApiError
     */
    public static createCloudflareStreamPerformerLiveInputOutput({
        performerId,
        liveInputId,
        requestBody,
    }: {
        /**
         * Performer ID
         */
        performerId: any,
        /**
         * Live input ID
         */
        liveInputId: any,
        /**
         * Simulcast output payload
         */
        requestBody: SimulcastOutputCreateIn,
    }): CancelablePromise<SimulcastOutputOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cloudflare-stream/performers/{performer_id}/live-inputs/{live_input_id}/outputs',
            path: {
                'performer_id': performerId,
                'live_input_id': liveInputId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Performer or live input not found`,
                422: `Validation failed`,
                502: `Cloudflare or performer-owner upstream failure`,
            },
        });
    }
    /**
     * Sync VOD recordings for a performer's live input
     * Validates the performer is owned by the caller, fetches the latest recordings from Cloudflare, and upserts them into the local catalog tagged with the performer ID. Empty list when the live input is missing or not owned by the performer .
     * @returns StreamVodListOut OK
     * @throws ApiError
     */
    public static syncCloudflareStreamPerformerLiveInputVod({
        performerId,
        liveInputId,
    }: {
        /**
         * Performer ID
         */
        performerId: any,
        /**
         * Live input ID
         */
        liveInputId: any,
    }): CancelablePromise<StreamVodListOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cloudflare-stream/performers/{performer_id}/live-inputs/{live_input_id}/vods/sync',
            path: {
                'performer_id': performerId,
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer not found`,
                422: `Invalid IDs`,
                502: `Cloudflare or performer-owner upstream failure`,
            },
        });
    }
}
