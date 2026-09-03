/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DistributePlaylistsOut } from '../models/DistributePlaylistsOut';
import type { DistributeYouTubeIn } from '../models/DistributeYouTubeIn';
import type { DistributionJobOut } from '../models/DistributionJobOut';
import type { DistributionStopOut } from '../models/DistributionStopOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MediaDistributeService {
    /**
     * List distribution jobs
     * Returns the caller's distribution jobs (uploads with
     * a populated `youtube_video_id` or `soundcloud_track_id`
     * column). Supports filtering by platform and status.
     * @returns DistributionJobOut OK
     * @throws ApiError
     */
    public static listDistributionJobs({
        platform,
        status,
        limit,
        offset,
    }: {
        /**
         * Filter by platform (youtube|soundcloud|instagram)
         */
        platform?: any,
        /**
         * Filter by upload status
         */
        status?: any,
        /**
         * Page size (default 50, max 100)
         */
        limit?: any,
        /**
         * Page offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<Array<DistributionJobOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-distribute/jobs',
            query: {
                'platform': platform,
                'status': status,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get distribution job status
     * Returns the per-job projection. Owner-only - non-owner
     * → 404 (BOLA-safe).
     * @returns DistributionJobOut OK
     * @throws ApiError
     */
    public static getDistributionStatus({
        jobId,
    }: {
        /**
         * Job UUID (= media_upload_id)
         */
        jobId: any,
    }): CancelablePromise<DistributionJobOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-distribute/jobs/{job_id}/status',
            path: {
                'job_id': jobId,
            },
            errors: {
                401: `Authentication required`,
                404: `Distribution job not found`,
                422: `Invalid job_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Stop a distribution job
     * Transition the job to "cancelled" if it's in-flight.
     * Already-terminal jobs (completed/failed) return 400.
     * Owner-only (BOLA-safe 404 for non-owner).
     * @returns DistributionStopOut OK
     * @throws ApiError
     */
    public static stopDistribution({
        jobId,
    }: {
        /**
         * Job UUID
         */
        jobId: any,
    }): CancelablePromise<DistributionStopOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-distribute/jobs/{job_id}/stop',
            path: {
                'job_id': jobId,
            },
            errors: {
                400: `Job in terminal state`,
                401: `Authentication required`,
                404: `Distribution job not found`,
                422: `Invalid job_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get user's playlists from a platform
     * Fetch the caller's playlists on the target platform so the FE can show "add to playlist X" picker. Tokens NEVER cross the worker boundary.
     * @returns DistributePlaylistsOut OK
     * @throws ApiError
     */
    public static getUserPlaylists({
        platform,
        limit,
        pageToken,
    }: {
        /**
         * Platform (youtube | soundcloud).
         */
        platform: any,
        /**
         * Max playlists (1..50, default 25)
         */
        limit?: any,
        /**
         * Provider pagination cursor
         */
        pageToken?: any,
    }): CancelablePromise<DistributePlaylistsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-distribute/playlists/{platform}',
            path: {
                'platform': platform,
            },
            query: {
                'limit': limit,
                'page_token': pageToken,
            },
            errors: {
                400: `PROVIDER_NOT_LINKED OR invalid limit`,
                401: `Authentication required or PROVIDER_TOKEN_EXPIRED`,
                422: `Invalid platform OR PROVIDER_NOT_IMPL (SC/IG on )`,
                429: `PROVIDER_RATE_LIMITED`,
                502: `PROVIDER_UPSTREAM`,
                503: `PROVIDER_UNCONFIGURED`,
            },
        });
    }
    /**
     * Distribute media to an external platform
     * SoundCloud and Instagram return 422 with code PROVIDER_NOT_IMPL - the wire shape is preserved so the FE can fall through. Tokens NEVER cross the worker boundary - social-platforms holds the OAuth credentials and performs the upload on the caller's behalf. Auth-first: claim, then ownership of upload_id (BOLA-safe 404 on non-owner), then platform-link check, then external call.
     * @returns DistributionJobOut OK
     * @throws ApiError
     */
    public static startDistribution({
        platform,
        requestBody,
    }: {
        /**
         * Target platform (youtube | soundcloud | instagram).
         */
        platform: any,
        /**
         * Platform-specific distribute payload. Shape varies by {platform}: YouTube → DistributeYouTubeIn, SoundCloud → DistributeSoundCloudIn, Instagram → DistributeInstagramIn.
         */
        requestBody: DistributeYouTubeIn,
    }): CancelablePromise<DistributionJobOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-distribute/{platform}',
            path: {
                'platform': platform,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body OR PROVIDER_NOT_LINKED`,
                401: `Authentication required or PROVIDER_TOKEN_EXPIRED`,
                404: `Upload not found OR caller is not owner (BOLA-safe)`,
                422: `Invalid platform OR PROVIDER_NOT_IMPL (SC/IG on )`,
                429: `PROVIDER_RATE_LIMITED`,
                502: `PROVIDER_UPSTREAM`,
                503: `PROVIDER_UNCONFIGURED`,
            },
        });
    }
}
