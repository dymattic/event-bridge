/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HeartbeatOut } from '../models/HeartbeatOut';
import type { IngestBatchIn } from '../models/IngestBatchIn';
import type { IngestBatchOut } from '../models/IngestBatchOut';
import type { StreamCreateIn } from '../models/StreamCreateIn';
import type { StreamCreateOut } from '../models/StreamCreateOut';
import type { StreamEndOut } from '../models/StreamEndOut';
import type { StreamTokenRefreshOut } from '../models/StreamTokenRefreshOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LiveStreamsService {
    /**
     * Start a live DJ stream
     * Opens a new live-stream session for the authenticated
     * user. Auto-ends any prior active stream owned by the
     * caller (its id is returned as `replaced_stream_id`).
     * Returns a short-lived publish-token scoped to the new
     * stream's heartbeat/end/ingest endpoints.
     * @returns StreamCreateOut Created
     * @throws ApiError
     */
    public static createLiveStream({
        requestBody,
    }: {
        /**
         * Stream create payload
         */
        requestBody: StreamCreateIn,
    }): CancelablePromise<StreamCreateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/streams',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * End a live DJ stream
     * Accepts either the DJ's user JWT (web-UI end) OR the
     * publish-token (desktop clean shutdown). Sets ended_at.
     * @returns StreamEndOut OK
     * @throws ApiError
     */
    public static endLiveStream({
        streamId,
    }: {
        /**
         * Stream UUID
         */
        streamId: any,
    }): CancelablePromise<StreamEndOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/streams/{stream_id}/end',
            path: {
                'stream_id': streamId,
            },
            errors: {
                401: `Authentication required`,
                403: `Wrong scope or wrong stream`,
                404: `Stream not found`,
                410: `Stream already ended`,
                422: `Invalid stream_id`,
            },
        });
    }
    /**
     * Heartbeat a live stream
     * Bumps the stream's `last_seen_at`. Desktop sends every
     * ~30s so a sleeping laptop / killed process is detected
     * by the stale-stream reaper. Publish-token required.
     * @returns HeartbeatOut OK
     * @throws ApiError
     */
    public static heartbeatLiveStream({
        streamId,
    }: {
        /**
         * Stream UUID
         */
        streamId: any,
    }): CancelablePromise<HeartbeatOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/streams/{stream_id}/heartbeat',
            path: {
                'stream_id': streamId,
            },
            errors: {
                401: `Missing / invalid publish token`,
                403: `Wrong scope or wrong stream`,
                404: `Stream not found`,
                410: `Stream has ended`,
                422: `Invalid stream_id`,
                429: `Too many heartbeats`,
            },
        });
    }
    /**
     * Ingest live DJ state (REST batch)
     * Merges partial deck / channel / master state into the
     * stream snapshot (last-write-wins) and persists every
     * `deck.loaded` event to the permanent set-log.
     * Idempotent by `(stream_id, seq)` within the seq scope.
     * Publish-token required.
     * @returns IngestBatchOut OK
     * @throws ApiError
     */
    public static ingestLiveStreamEvents({
        streamId,
        requestBody,
    }: {
        /**
         * Stream UUID
         */
        streamId: any,
        /**
         * Ingest batch
         */
        requestBody: IngestBatchIn,
    }): CancelablePromise<IngestBatchOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/streams/{stream_id}/ingest',
            path: {
                'stream_id': streamId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Missing / invalid publish token`,
                403: `Wrong scope or wrong stream`,
                404: `Stream not found`,
                410: `Stream has ended`,
                422: `Invalid stream_id or event`,
                429: `Too many ingest batches`,
            },
        });
    }
    /**
     * Refresh a live-stream publish token in place
     * Mints a fresh short-lived publish-token bound to the SAME
     * stream_id (unchanged), extending the TTL without ending
     * the stream. Present the current publish-token, OR a
     * recently-expired one (within a server-side grace window)
     * for a still-active stream you own. Unlike POST /streams,
     * this keeps stream_id stable so one continuous set is not
     * fragmented into many. Same wire fields as create
     * (publish_token, publish_token_expires_at).
     * @returns StreamTokenRefreshOut OK
     * @throws ApiError
     */
    public static refreshLiveStreamToken({
        streamId,
    }: {
        /**
         * Stream UUID
         */
        streamId: any,
    }): CancelablePromise<StreamTokenRefreshOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/streams/{stream_id}/token-refresh',
            path: {
                'stream_id': streamId,
            },
            errors: {
                401: `Missing / invalid / grace-expired publish token`,
                403: `Wrong scope or wrong stream`,
                404: `Stream not found`,
                410: `Stream has ended`,
                422: `Invalid stream_id`,
            },
        });
    }
}
