/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingSnapshotOut } from '../models/BillingSnapshotOut';
import type { CloudflareStreamUsageOut } from '../models/CloudflareStreamUsageOut';
import type { CloudflareStreamWebhookIn } from '../models/CloudflareStreamWebhookIn';
import type { HetznerStorageUsageOut } from '../models/HetznerStorageUsageOut';
import type { LiveInputCreateIn } from '../models/LiveInputCreateIn';
import type { LiveInputDetailOut } from '../models/LiveInputDetailOut';
import type { LiveInputListOut } from '../models/LiveInputListOut';
import type { LiveInputUpdateIn } from '../models/LiveInputUpdateIn';
import type { SimulcastOutputCreateIn } from '../models/SimulcastOutputCreateIn';
import type { SimulcastOutputListOut } from '../models/SimulcastOutputListOut';
import type { SimulcastOutputOut } from '../models/SimulcastOutputOut';
import type { SimulcastOutputUpdateIn } from '../models/SimulcastOutputUpdateIn';
import type { StreamEmbedInfoOut } from '../models/StreamEmbedInfoOut';
import type { StreamVodListOut } from '../models/StreamVodListOut';
import type { StreamVodOut } from '../models/StreamVodOut';
import type { UserStreamingCostSummaryOut } from '../models/UserStreamingCostSummaryOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CloudflareStreamService {
    /**
     * Get Cloudflare Stream costs for the caller
     * Returns CF Stream storage + delivery minutes and the projected USD cost. Delivery minutes are sourced from the reconciled usage meter - currently surfaces 0 .
     * @returns CloudflareStreamUsageOut OK
     * @throws ApiError
     */
    public static getCloudflareStreamCosts(): CancelablePromise<CloudflareStreamUsageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/billing/cloudflare',
            errors: {
                401: `Authentication required`,
                500: `Billing aggregation failed`,
            },
        });
    }
    /**
     * Get Hetzner Object Storage costs for the caller
     * Sums cf_stream_vods.size_bytes across the caller's VODs and applies Hetzner pricing. file_size (owned by media-ingest) which the Go port can't yet reach via a cross-worker contract.
     * @returns HetznerStorageUsageOut OK
     * @throws ApiError
     */
    public static getHetznerStorageCosts(): CancelablePromise<HetznerStorageUsageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/billing/hetzner',
            errors: {
                401: `Authentication required`,
                500: `Storage aggregation failed`,
            },
        });
    }
    /**
     * Persist a billing snapshot for the caller
     * Computes a summary and writes it to cf_stream_usage_logs. Returns the persisted snapshot id + timestamp.
     * @returns BillingSnapshotOut Created
     * @throws ApiError
     */
    public static recordCloudflareBillingSnapshot(): CancelablePromise<BillingSnapshotOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cloudflare-stream/billing/snapshot',
            errors: {
                401: `Authentication required`,
                500: `Snapshot persist failed`,
            },
        });
    }
    /**
     * Get combined CF Stream + Hetzner cost summary for the caller
     * Combines CF + Hetzner and converts to USD via the EUR-USD rate.
     * @returns UserStreamingCostSummaryOut OK
     * @throws ApiError
     */
    public static getStreamingBillingSummary(): CancelablePromise<UserStreamingCostSummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/billing/summary',
            errors: {
                401: `Authentication required`,
                500: `Billing aggregation failed`,
            },
        });
    }
    /**
     * List the caller's Cloudflare Stream live inputs
     * Cursor-paginated by created_at DESC. Returns the wide live-input detail (including decrypted ingest credentials).
     * @returns LiveInputListOut OK
     * @throws ApiError
     */
    public static listLiveInputs({
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
            url: '/cloudflare-stream/live-inputs',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid query parameter`,
            },
        });
    }
    /**
     * Create a Cloudflare Stream live input
     * Provisions a new live input on Cloudflare, persists the local record with at-rest-encrypted credentials, and returns the ingest endpoints. RTMPS / SRT stream keys are returned in plaintext on this response.
     * @returns LiveInputDetailOut Created
     * @throws ApiError
     */
    public static createLiveInput({
        requestBody,
    }: {
        /**
         * Live-input create payload
         */
        requestBody: LiveInputCreateIn,
    }): CancelablePromise<LiveInputDetailOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cloudflare-stream/live-inputs',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Validation failed`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
    /**
     * Delete a live input
     * Removes the live input on Cloudflare and locally. Cascade removes simulcast outputs and recorded VODs.
     * @returns void
     * @throws ApiError
     */
    public static deleteLiveInput({
        liveInputId,
    }: {
        /**
         * Live input ID
         */
        liveInputId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cloudflare-stream/live-inputs/{live_input_id}',
            path: {
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                404: `Live input not found`,
                422: `Invalid live_input_id`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
    /**
     * Get one live input
     * Returns one live input owned by the authenticated user. BOLA-safe: not-owner → 404.
     * @returns LiveInputDetailOut OK
     * @throws ApiError
     */
    public static getLiveInput({
        liveInputId,
    }: {
        /**
         * Live input ID (bare UUID or `cfli_<uuid>`)
         */
        liveInputId: any,
    }): CancelablePromise<LiveInputDetailOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/live-inputs/{live_input_id}',
            path: {
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                404: `Live input not found`,
                422: `Invalid live_input_id`,
            },
        });
    }
    /**
     * Update a live input
     * Patches a live input; only provided fields are written. Syncs the diff to Cloudflare.
     * @returns LiveInputDetailOut OK
     * @throws ApiError
     */
    public static updateLiveInput({
        liveInputId,
        requestBody,
    }: {
        /**
         * Live input ID
         */
        liveInputId: any,
        /**
         * Patch payload
         */
        requestBody: LiveInputUpdateIn,
    }): CancelablePromise<LiveInputDetailOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/cloudflare-stream/live-inputs/{live_input_id}',
            path: {
                'live_input_id': liveInputId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Live input not found`,
                422: `Invalid live_input_id`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
    /**
     * Get embed URLs for a live input
     * Returns iframe / HLS / DASH player URLs for one of the caller's Cloudflare Stream live inputs. BOLA-hardened - not-owner sees 404, not 403. `is_live=true` (live-input embed; VOD embed has its own endpoint).
     * @returns StreamEmbedInfoOut OK
     * @throws ApiError
     */
    public static getLiveEmbedInfo({
        liveInputId,
    }: {
        /**
         * Live input ID (bare UUID or `cfli_<uuid>`)
         */
        liveInputId: any,
    }): CancelablePromise<StreamEmbedInfoOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/live-inputs/{live_input_id}/embed',
            path: {
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                404: `Live input not found`,
                422: `Invalid live_input_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List simulcast outputs
     * Returns the simulcast (re-stream) outputs configured for one of the caller's live inputs. Cross-user / missing parent → empty list .
     * @returns SimulcastOutputListOut OK
     * @throws ApiError
     */
    public static listSimulcastOutputs({
        liveInputId,
    }: {
        /**
         * Live input ID (bare UUID or `cfli_<uuid>`)
         */
        liveInputId: any,
    }): CancelablePromise<SimulcastOutputListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/live-inputs/{live_input_id}/outputs',
            path: {
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid live_input_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a simulcast output
     * Attaches a simulcast (re-stream) destination to a live input. The destination stream key is encrypted at rest.
     * @returns SimulcastOutputOut Created
     * @throws ApiError
     */
    public static addSimulcastOutput({
        liveInputId,
        requestBody,
    }: {
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
            url: '/cloudflare-stream/live-inputs/{live_input_id}/outputs',
            path: {
                'live_input_id': liveInputId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Live input not found`,
                422: `Validation failed`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
    /**
     * Remove a simulcast output
     * Drops a simulcast output from a live input. Removes on Cloudflare and locally.
     * @returns void
     * @throws ApiError
     */
    public static deleteSimulcastOutput({
        liveInputId,
        outputId,
    }: {
        /**
         * Live input ID
         */
        liveInputId: any,
        /**
         * Simulcast output ID
         */
        outputId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cloudflare-stream/live-inputs/{live_input_id}/outputs/{output_id}',
            path: {
                'live_input_id': liveInputId,
                'output_id': outputId,
            },
            errors: {
                401: `Authentication required`,
                404: `Live input or output not found`,
                422: `Invalid IDs`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
    /**
     * Enable/disable a simulcast output
     * Flips the enabled flag on a simulcast output. Mirrors the change to Cloudflare.
     * @returns SimulcastOutputOut OK
     * @throws ApiError
     */
    public static updateSimulcastOutput({
        liveInputId,
        outputId,
        requestBody,
    }: {
        /**
         * Live input ID
         */
        liveInputId: any,
        /**
         * Simulcast output ID
         */
        outputId: any,
        /**
         * Patch payload
         */
        requestBody: SimulcastOutputUpdateIn,
    }): CancelablePromise<SimulcastOutputOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/cloudflare-stream/live-inputs/{live_input_id}/outputs/{output_id}',
            path: {
                'live_input_id': liveInputId,
                'output_id': outputId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Live input or output not found`,
                422: `Invalid IDs`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
    /**
     * Sync VOD recordings from Cloudflare
     * Pulls VOD recordings for a live input from Cloudflare and upserts them into the local catalog.
     * @returns StreamVodListOut OK
     * @throws ApiError
     */
    public static syncCloudflareVods({
        liveInputId,
    }: {
        /**
         * Live input ID
         */
        liveInputId: any,
    }): CancelablePromise<StreamVodListOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cloudflare-stream/live-inputs/{live_input_id}/vods/sync',
            path: {
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                404: `Live input not found`,
                422: `Invalid live_input_id`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
    /**
     * Get embed URLs for a performer's live input
     * Returns iframe / HLS / DASH player URLs for a live input belonging to one of the caller's performer profiles. BOLA-hardened - performer-not-owned and live-input-not-found both collapse to 404. `is_live=true`. Combines a cross-worker performer-ownership lookup with the cloudflare-stream-side live-input read.
     * @returns StreamEmbedInfoOut OK
     * @throws ApiError
     */
    public static getPerformerLiveEmbed({
        performerId,
        liveInputId,
    }: {
        /**
         * Performer ID (bare UUID or `perf_<uuid>`)
         */
        performerId: any,
        /**
         * Live input ID (bare UUID or `cfli_<uuid>`)
         */
        liveInputId: any,
    }): CancelablePromise<StreamEmbedInfoOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/performers/{performer_id}/live-inputs/{live_input_id}/embed',
            path: {
                'performer_id': performerId,
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer not found or live input not found`,
                422: `Invalid performer_id or live_input_id`,
                500: `Internal error`,
                502: `Could not verify performer ownership`,
            },
        });
    }
    /**
     * List a performer's VOD recordings
     * Returns VOD recordings tagged to one of the caller's performer profiles. BOLA-hardened - performer-not-owned collapses to 404 (not 403), so performer ids cannot be enumerated cross-user. Combines a cross-worker performer-ownership lookup with the cloudflare-stream-side VOD list.
     * @returns StreamVodListOut OK
     * @throws ApiError
     */
    public static listCloudflareStreamPerformerVods({
        performerId,
        limit,
        cursor,
        liveInputId,
    }: {
        /**
         * Performer ID (bare UUID or `perf_<uuid>`)
         */
        performerId: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * ISO-8601 created_at cursor from a prior response
         */
        cursor?: any,
        /**
         * Filter by parent live input (bare UUID or `cfli_<uuid>`)
         */
        liveInputId?: any,
    }): CancelablePromise<StreamVodListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/performers/{performer_id}/vods',
            path: {
                'performer_id': performerId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer not found`,
                422: `Invalid performer_id or query parameter`,
                500: `Internal error`,
                502: `Could not verify performer ownership`,
            },
        });
    }
    /**
     * Get one performer VOD
     * Returns one VOD recording tagged to a performer the caller owns. BOLA-hardened - performer-not-owned and VOD-not-found both collapse to 404. Combines a cross-worker performer-ownership lookup with the cloudflare-stream-side VOD read.
     * @returns StreamVodOut OK
     * @throws ApiError
     */
    public static getCloudflareStreamPerformerVod({
        performerId,
        vodId,
    }: {
        /**
         * Performer ID (bare UUID or `perf_<uuid>`)
         */
        performerId: any,
        /**
         * VOD ID (bare UUID or `cfv_<uuid>`)
         */
        vodId: any,
    }): CancelablePromise<StreamVodOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/performers/{performer_id}/vods/{vod_id}',
            path: {
                'performer_id': performerId,
                'vod_id': vodId,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer not found or VOD not found`,
                422: `Invalid performer_id or vod_id`,
                500: `Internal error`,
                502: `Could not verify performer ownership`,
            },
        });
    }
    /**
     * Get embed URLs for a performer's VOD
     * Returns iframe / HLS / DASH player URLs for a VOD tagged to one of the caller's performer profiles. BOLA-hardened - performer-not-owned or VOD-not-found collapse to 404 (not 403), so performer ids cannot be enumerated cross-user. Combines a cross-worker performer-ownership lookup with the cloudflare-stream-side VOD read.
     * @returns StreamEmbedInfoOut OK
     * @throws ApiError
     */
    public static embedCloudflareStreamPerformerVod({
        performerId,
        vodId,
    }: {
        /**
         * Performer ID (bare UUID or `perf_<uuid>`)
         */
        performerId: any,
        /**
         * VOD ID (bare UUID or `cfv_<uuid>`)
         */
        vodId: any,
    }): CancelablePromise<StreamEmbedInfoOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/performers/{performer_id}/vods/{vod_id}/embed',
            path: {
                'performer_id': performerId,
                'vod_id': vodId,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer not found or VOD not found`,
                422: `Invalid performer_id or vod_id`,
                500: `Internal error`,
                502: `Could not verify performer ownership`,
            },
        });
    }
    /**
     * List the caller's VOD recordings
     * Returns the authenticated user's Cloudflare Stream VOD recordings, paginated by `created_at DESC`. Supports filtering by `live_input_id`. The optional `cursor` is the ISO-8601 timestamp of the previous page's last item.
     * @returns StreamVodListOut OK
     * @throws ApiError
     */
    public static listVods({
        limit,
        cursor,
        liveInputId,
    }: {
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * ISO-8601 created_at cursor from a prior response
         */
        cursor?: any,
        /**
         * Filter by parent live input (bare UUID or `cfli_<uuid>`)
         */
        liveInputId?: any,
    }): CancelablePromise<StreamVodListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/vods',
            query: {
                'limit': limit,
                'cursor': cursor,
                'live_input_id': liveInputId,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid query parameter`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a VOD recording
     * Removes a VOD recording from Cloudflare and the local catalog.
     * @returns void
     * @throws ApiError
     */
    public static deleteVod({
        vodId,
    }: {
        /**
         * VOD ID (bare UUID or `cfv_<uuid>`)
         */
        vodId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cloudflare-stream/vods/{vod_id}',
            path: {
                'vod_id': vodId,
            },
            errors: {
                401: `Authentication required`,
                404: `VOD not found`,
                422: `Invalid vod_id`,
                502: `Cloudflare upstream failure`,
            },
        });
    }
    /**
     * Get a single VOD
     * Returns one VOD recording owned by the authenticated user. BOLA-hardening: not-owner sees 404, not 403, so vod-ids cannot be enumerated across users.
     * @returns StreamVodOut OK
     * @throws ApiError
     */
    public static getVod({
        vodId,
    }: {
        /**
         * VOD ID (bare UUID or `cfv_<uuid>`)
         */
        vodId: any,
    }): CancelablePromise<StreamVodOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/vods/{vod_id}',
            path: {
                'vod_id': vodId,
            },
            errors: {
                401: `Authentication required`,
                404: `VOD not found`,
                422: `Invalid vod id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get embed URLs for a VOD
     * Returns iframe / HLS / DASH player URLs for one of the caller's Cloudflare Stream VOD recordings. BOLA-hardened - not-owner sees 404, not 403, so VOD ids cannot be enumerated across users.
     * @returns StreamEmbedInfoOut OK
     * @throws ApiError
     */
    public static getVodEmbedInfo({
        vodId,
    }: {
        /**
         * VOD ID (bare UUID or `cfv_<uuid>`)
         */
        vodId: any,
    }): CancelablePromise<StreamEmbedInfoOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cloudflare-stream/vods/{vod_id}/embed',
            path: {
                'vod_id': vodId,
            },
            errors: {
                401: `Authentication required`,
                404: `VOD not found`,
                422: `Invalid vod id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Cloudflare Stream webhook receiver
     * Receives connected / disconnected / errored events from Cloudflare Stream and flips the local live-input status. Anonymous-accepting - the HMAC signature against CLOUDFLARE_STREAM_WEBHOOK_SECRET IS the auth gate. Body cap 1 MiB. Constant-time signature compare.
     * @returns void
     * @throws ApiError
     */
    public static cloudflareStreamWebhook({
        requestBody,
        webhookSignature,
        webhookTimestamp,
    }: {
        /**
         * CF webhook payload
         */
        requestBody: CloudflareStreamWebhookIn,
        /**
         * HMAC-SHA256 hex of body, signed with CLOUDFLARE_STREAM_WEBHOOK_SECRET
         */
        webhookSignature?: any,
        /**
         * Optional unix-seconds timestamp; rejected if >5 min skew
         */
        webhookTimestamp?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cloudflare-stream/webhooks',
            headers: {
                'Webhook-Signature': webhookSignature,
                'Webhook-Timestamp': webhookTimestamp,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Missing or invalid signature`,
                413: `Webhook body exceeds 1 MiB`,
                422: `Missing required fields`,
            },
        });
    }
}
