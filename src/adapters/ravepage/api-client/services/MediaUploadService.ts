/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChunkUploadNativeResponse } from '../models/ChunkUploadNativeResponse';
import type { InitiateUploadRequest } from '../models/InitiateUploadRequest';
import type { InitiateUploadResponse } from '../models/InitiateUploadResponse';
import type { MediaUploadResponse } from '../models/MediaUploadResponse';
import type { MediaUploadUpdate } from '../models/MediaUploadUpdate';
import type { UploadStatusOut } from '../models/UploadStatusOut';
import type { UserUploadsResponse } from '../models/UserUploadsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MediaUploadService {
    /**
     * Initiate chunked upload
     * Opens a chunked upload session and returns the chunk plan.
     * An `audio*` upload is capped at 2 GiB (413) - sized for a
     * full lossless DJ-set recording; other mime families are
     * unchanged.
     * @returns InitiateUploadResponse OK
     * @throws ApiError
     */
    public static initiateUpload({
        requestBody,
    }: {
        /**
         * Upload-initiate payload
         */
        requestBody: InitiateUploadRequest,
    }): CancelablePromise<InitiateUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-upload/initiate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                413: `Body too large, or audio upload over 2 GiB`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * List my media uploads
     * Returns the caller's uploads (paginated).
     * @returns UserUploadsResponse OK
     * @throws ApiError
     */
    public static listUserUploads({
        skip,
        limit,
        status,
    }: {
        /**
         * Pagination offset
         */
        skip?: any,
        /**
         * Page size
         */
        limit?: any,
        /**
         * Filter by upload lifecycle state (UploadStatusFilter enum)
         */
        status?: any,
    }): CancelablePromise<UserUploadsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-upload/user-uploads',
            query: {
                'skip': skip,
                'limit': limit,
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Delete media upload
     * Removes an upload (and its blob).
     * @returns void
     * @throws ApiError
     */
    public static deleteUpload({
        uploadId,
    }: {
        /**
         * Upload ID
         */
        uploadId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/media-upload/{upload_id}',
            path: {
                'upload_id': uploadId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Upload not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Upload a chunk
     * Uploads a single chunk of an in-progress chunked upload.
     * @returns ChunkUploadNativeResponse OK
     * @throws ApiError
     */
    public static uploadChunk({
        uploadId,
        chunkNumber,
    }: {
        /**
         * Upload ID
         */
        uploadId: any,
        /**
         * Chunk index (0-based)
         */
        chunkNumber: any,
    }): CancelablePromise<ChunkUploadNativeResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/media-upload/{upload_id}/chunks/{chunk_number}',
            path: {
                'upload_id': uploadId,
                'chunk_number': chunkNumber,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Upload not found`,
                409: `Wrong chunk state`,
                413: `Chunk too large`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Complete chunked upload
     * Closes a chunked upload session and triggers pipeline processing.
     * @returns MediaUploadResponse OK
     * @throws ApiError
     */
    public static completeUpload({
        uploadId,
    }: {
        /**
         * Upload ID
         */
        uploadId: any,
    }): CancelablePromise<MediaUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-upload/{upload_id}/complete',
            path: {
                'upload_id': uploadId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Upload not found`,
                409: `Missing chunks`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Update media upload metadata
     * Patches title / description / tags on an upload owned by the caller.
     * @returns MediaUploadResponse OK
     * @throws ApiError
     */
    public static updateUploadMetadata({
        uploadId,
        requestBody,
    }: {
        /**
         * Upload ID
         */
        uploadId: any,
        /**
         * Patch payload
         */
        requestBody: MediaUploadUpdate,
    }): CancelablePromise<MediaUploadResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/media-upload/{upload_id}/metadata',
            path: {
                'upload_id': uploadId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Upload not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get upload status
     * Returns the upload pipeline status for a single upload.
     *
     * Resume contract: `uploaded_chunk_numbers` is the list of
     * 0-based chunk indices the server already holds - the same key
     * and semantics as the `POST /media-upload/initiate` response,
     * so a client may resume from either. Do NOT drive resume off
     * `missing_chunks`: it enumerates only chunk rows explicitly
     * flagged not-uploaded, and rows exist only after a successful
     * PUT, so it is `[]` both when the upload is complete AND when
     * nothing has been sent yet. For progress, compare
     * `uploaded_chunks` against `total_chunks`.
     * @returns UploadStatusOut OK
     * @throws ApiError
     */
    public static getUploadStatus({
        uploadId,
    }: {
        /**
         * Upload ID
         */
        uploadId: any,
    }): CancelablePromise<UploadStatusOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-upload/{upload_id}/status',
            path: {
                'upload_id': uploadId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Upload not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
