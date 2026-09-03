/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuadFingerprintUploadIn } from '../models/QuadFingerprintUploadIn';
import type { QuadFingerprintUploadOut } from '../models/QuadFingerprintUploadOut';
import type { QuadPositionIn } from '../models/QuadPositionIn';
import type { QuadPositionsBulkOut } from '../models/QuadPositionsBulkOut';
import type { QuadPositionsListOut } from '../models/QuadPositionsListOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuadFingerprintsService {
    /**
     * Upload a library track's quad fingerprint
     * Stores one library track's quad fingerprint (shared/quadfp wire blob, base64) as the closed-set match reference. Replaces any prior fingerprint for this (caller, library track). `format_version` MUST equal the server's quadfp.FormatVersion or the upload is rejected 422.
     * @returns QuadFingerprintUploadOut Created
     * @throws ApiError
     */
    public static upsertLibraryQuadFingerprint({
        libraryTrackId,
        requestBody,
    }: {
        /**
         * Library track ID (lib_<uuid> or bare UUID)
         */
        libraryTrackId: any,
        /**
         * Quad blob payload
         */
        requestBody: QuadFingerprintUploadIn,
    }): CancelablePromise<QuadFingerprintUploadOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/library/tracks/{library_track_id}/quad-fingerprint',
            path: {
                'library_track_id': libraryTrackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required`,
                422: `Bad blob / format version /`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Upload a recorded set's quad fingerprint
     * Stores a recorded DJ set's quad fingerprint (shared/quadfp wire blob, base64) and enqueues the closed-set match job that computes where each library track plays in the set. Owner-only. Replaces any prior set fingerprint for this stream. `format_version` MUST equal the server's quadfp.FormatVersion.
     * @returns QuadFingerprintUploadOut Created
     * @throws ApiError
     */
    public static upsertSetQuadFingerprint({
        streamId,
        requestBody,
    }: {
        /**
         * Stream ID (strm_<uuid> or bare UUID)
         */
        streamId: any,
        /**
         * Quad blob payload
         */
        requestBody: QuadFingerprintUploadIn,
    }): CancelablePromise<QuadFingerprintUploadOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/streams/{stream_id}/quad-fingerprint',
            path: {
                'stream_id': streamId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                404: `Stream not found (or not owned)`,
                422: `Bad blob / format version /`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List a set's computed track positions
     * Returns where each library/canonical track plays inside the set: in/out points (ms), the tempo + pitch scale the DJ applied, layer depth (simultaneous tracks), and the source (api_computed | client_uploaded). Gated by the stream's visibility (owner always; others per public/unlisted/logged_in).
     * @returns QuadPositionsListOut OK
     * @throws ApiError
     */
    public static listQuadPositions({
        streamId,
    }: {
        /**
         * Stream ID (strm_<uuid> or bare UUID)
         */
        streamId: any,
    }): CancelablePromise<QuadPositionsListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/streams/{stream_id}/quad-positions',
            path: {
                'stream_id': streamId,
            },
            errors: {
                404: `Stream not found / not visible`,
                422: `Malformed id /`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Upload client-computed track positions
     * The opt-in local-compute path: the DJ's app computed the track positions itself and uploads them. Replaces all client-uploaded positions for this stream (server-computed positions are untouched). Owner-only.
     * @returns QuadPositionsBulkOut OK
     * @throws ApiError
     */
    public static bulkUploadQuadPositions({
        streamId,
        requestBody,
    }: {
        /**
         * Stream ID (strm_<uuid> or bare UUID)
         */
        streamId: any,
        /**
         * Positions
         */
        requestBody: Array<QuadPositionIn>,
    }): CancelablePromise<QuadPositionsBulkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/streams/{stream_id}/quad-positions/bulk',
            path: {
                'stream_id': streamId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                404: `Stream not found (or not owned)`,
                422: `Bad body /`,
                500: `Internal error`,
            },
        });
    }
}
