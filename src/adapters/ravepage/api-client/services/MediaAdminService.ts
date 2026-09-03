/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminMediaPipelineItemOut } from '../models/AdminMediaPipelineItemOut';
import type { AdminMediaPipelineListOut } from '../models/AdminMediaPipelineListOut';
import type { AdminMediaPipelineMarkReadyOut } from '../models/AdminMediaPipelineMarkReadyOut';
import type { AdminMediaPipelineRetryOut } from '../models/AdminMediaPipelineRetryOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MediaAdminService {
    /**
     * Admin: list media upload pipeline
     * Admin-only triage view of media uploads filtered by pipeline state.
     * @returns AdminMediaPipelineListOut OK
     * @throws ApiError
     */
    public static adminListMediaPipeline({
        pipelineStatus,
        includeReady,
        userId,
        limit,
        offset,
    }: {
        /**
         * Filter by pipeline status
         */
        pipelineStatus?: any,
        /**
         * Include ready uploads
         */
        includeReady?: any,
        /**
         * Filter by user ID
         */
        userId?: any,
        /**
         * Page size
         */
        limit?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<AdminMediaPipelineListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/media-uploads/pipeline',
            query: {
                'pipeline_status': pipelineStatus,
                'include_ready': includeReady,
                'user_id': userId,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Unauthorized`,
                403: `Admin only`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Admin: get media upload pipeline state
     * Admin-only single upload pipeline detail.
     * @returns AdminMediaPipelineItemOut OK
     * @throws ApiError
     */
    public static adminGetPipelineForUpload({
        uploadId,
    }: {
        /**
         * Upload ID
         */
        uploadId: any,
    }): CancelablePromise<AdminMediaPipelineItemOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/media-uploads/{upload_id}/pipeline',
            path: {
                'upload_id': uploadId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Upload not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Admin: mark media upload ready
     * Force-marks a held upload as ready (bypasses pipeline).
     * @returns AdminMediaPipelineMarkReadyOut OK
     * @throws ApiError
     */
    public static adminMarkMediaReady({
        uploadId,
    }: {
        /**
         * Upload ID
         */
        uploadId: any,
    }): CancelablePromise<AdminMediaPipelineMarkReadyOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/media-uploads/{upload_id}/pipeline/mark-ready',
            path: {
                'upload_id': uploadId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Admin: retry media upload pipeline
     * Re-enqueues a failed upload back into the processing pipeline.
     * @returns AdminMediaPipelineRetryOut OK
     * @throws ApiError
     */
    public static adminRetryMediaPipeline({
        uploadId,
    }: {
        /**
         * Upload ID
         */
        uploadId: any,
    }): CancelablePromise<AdminMediaPipelineRetryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/media-uploads/{upload_id}/pipeline/retry',
            path: {
                'upload_id': uploadId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Wrong state`,
            },
        });
    }
}
