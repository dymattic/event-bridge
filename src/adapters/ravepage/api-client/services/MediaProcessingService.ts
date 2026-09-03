/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllFormatsOut } from '../models/AllFormatsOut';
import type { AudioExtractIn } from '../models/AudioExtractIn';
import type { AudioFormatsOut } from '../models/AudioFormatsOut';
import type { ProcessingTaskStatus } from '../models/ProcessingTaskStatus';
import type { ProcessingTaskStopOut } from '../models/ProcessingTaskStopOut';
import type { TaskOut } from '../models/TaskOut';
import type { TaskResponseOut } from '../models/TaskResponseOut';
import type { TaskRestartIn } from '../models/TaskRestartIn';
import type { VideoCompressIn } from '../models/VideoCompressIn';
import type { VideoConvertIn } from '../models/VideoConvertIn';
import type { VideoCutIn } from '../models/VideoCutIn';
import type { VideoFormatsOut } from '../models/VideoFormatsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MediaProcessingService {
    /**
     * List all format presets
     * Anonymous-public combined catalog of every video and audio preset. Returns both maps + their respective counts.
     * @returns AllFormatsOut OK
     * @throws ApiError
     */
    public static getAllFormats(): CancelablePromise<AllFormatsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-processing/formats',
        });
    }
    /**
     * List audio format presets
     * Anonymous-public catalog of FFmpeg audio extraction presets (codec, bitrate, sample rate, channels). Backs the FE upload-prep preset picker.
     * @returns AudioFormatsOut OK
     * @throws ApiError
     */
    public static getAudioFormats(): CancelablePromise<AudioFormatsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-processing/formats/audio',
        });
    }
    /**
     * List video format presets
     * Anonymous-public catalog of FFmpeg video conversion presets (container, codec, bitrate, resolution, etc.). Backs the FE upload-prep preset picker.
     * @returns VideoFormatsOut OK
     * @throws ApiError
     */
    public static getVideoFormats(): CancelablePromise<VideoFormatsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-processing/formats/video',
        });
    }
    /**
     * List processing tasks for current user
     * Returns a list of all media-processing tasks owned by
     * the authenticated user, with status, progress, and
     * metadata. Tasks are `media_uploads` rows projected
     * through a status-step progress mapping (pending=0,
     * processing=50, completed/processed=100). Supports
     * optional `status` filter pass-through.
     * @returns ProcessingTaskStatus OK
     * @throws ApiError
     */
    public static listProcessingTasks({
        status,
        limit,
        offset,
    }: {
        /**
         * Filter by upload status (pass-through; not validated)
         */
        status?: any,
        /**
         * Page size (default 50, max 1000)
         */
        limit?: any,
        /**
         * Page offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<Array<ProcessingTaskStatus>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-processing/tasks',
            query: {
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
     * Restart a processing task
     * Reset an owner-owned upload's status to `pending` so the
     * pipeline can re-pick it. Owner-only (BOLA-safe 404 for
     * non-owner). Body: `{operation, parameters}`; operation
     * must be one of cut|convert|extract_audio|compress.
     * @returns TaskResponseOut OK
     * @throws ApiError
     */
    public static restartTask({
        mediaUploadId,
        requestBody,
    }: {
        /**
         * Upload UUID or upl_<uuid>
         */
        mediaUploadId: any,
        /**
         * Restart payload
         */
        requestBody: TaskRestartIn,
    }): CancelablePromise<TaskResponseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-processing/tasks/{media_upload_id}/restart',
            path: {
                'media_upload_id': mediaUploadId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body or operation`,
                401: `Authentication required`,
                404: `Media upload not found`,
                422: `Invalid upload_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get processing task status by upload id
     * Returns the status, progress, and metadata for one
     * processing task owned by the authenticated user. The
     * task id is the underlying media_upload_id (bare UUID
     * or `upl_<uuid>` prefixed form accepted). 404 when the
     * upload doesn't exist OR doesn't belong to the caller
     * (BOLA-safe).
     * @returns ProcessingTaskStatus OK
     * @throws ApiError
     */
    public static getTaskStatus({
        mediaUploadId,
    }: {
        /**
         * Upload UUID or upl_<uuid>
         */
        mediaUploadId: any,
    }): CancelablePromise<ProcessingTaskStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-processing/tasks/{media_upload_id}/status',
            path: {
                'media_upload_id': mediaUploadId,
            },
            errors: {
                401: `Authentication required`,
                404: `Media upload not found`,
                422: `Invalid upload_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Stop a processing task
     * Transition an in-flight upload (status `pending` or
     * `processing`) to `cancelled`. Owner-only - non-owner
     * returns 404 (BOLA-safe). Already-terminal uploads
     * return 200 with `{success: false, message: ...
     * @returns ProcessingTaskStopOut OK
     * @throws ApiError
     */
    public static stopTask({
        mediaUploadId,
    }: {
        /**
         * Upload UUID or upl_<uuid>
         */
        mediaUploadId: any,
    }): CancelablePromise<ProcessingTaskStopOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-processing/tasks/{media_upload_id}/stop',
            path: {
                'media_upload_id': mediaUploadId,
            },
            errors: {
                401: `Authentication required`,
                404: `Media upload not found`,
                422: `Invalid upload_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get user's media uploads with processing metadata
     * get_user_uploads` is the
     * shared implementation under both paths. Owner-only; the
     * page is the caller's uploads.
     * @returns ProcessingTaskStatus OK
     * @throws ApiError
     */
    public static getUserUploadsProcessing({
        statusFilter,
        limit,
        offset,
    }: {
        /**
         * Filter by status
         */
        statusFilter?: any,
        /**
         * Page size (default 50, max 1000)
         */
        limit?: any,
        /**
         * Page offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<Array<ProcessingTaskStatus>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-processing/user-uploads',
            query: {
                'status_filter': statusFilter,
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
     * Compress a video
     * Queue a background task to compress a video to a target
     * file size or quality level. Owner-only (BOLA-safe 404
     * for non-owner).
     * @returns TaskOut OK
     * @throws ApiError
     */
    public static compressVideo({
        requestBody,
    }: {
        /**
         * Compress payload
         */
        requestBody: VideoCompressIn,
    }): CancelablePromise<TaskOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-processing/video/compress',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Media upload not found`,
                422: `Missing or malformed upload_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Convert video format/quality
     * Queue a background task to convert a video to a
     * different format, codec, resolution, or quality preset.
     * Owner-only (BOLA-safe 404 for non-owner).
     * @returns TaskOut OK
     * @throws ApiError
     */
    public static convertVideo({
        requestBody,
    }: {
        /**
         * Convert payload
         */
        requestBody: VideoConvertIn,
    }): CancelablePromise<TaskOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-processing/video/convert',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Media upload not found`,
                422: `Missing or malformed upload_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Cut/trim a video
     * Queue a background task to cut/trim a video by
     * specifying start time and duration or end time. Owner-
     * only (BOLA-safe 404 for non-owner).
     * @returns TaskOut OK
     * @throws ApiError
     */
    public static cutVideo({
        requestBody,
    }: {
        /**
         * Cut payload
         */
        requestBody: VideoCutIn,
    }): CancelablePromise<TaskOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-processing/video/cut',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Media upload not found`,
                422: `Missing or malformed upload_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Extract audio from video
     * Queue a background task to extract the audio track from
     * a video file into a standalone audio file. Owner-only
     * (BOLA-safe 404 for non-owner).
     * @returns TaskOut OK
     * @throws ApiError
     */
    public static extractAudio({
        requestBody,
    }: {
        /**
         * Extract-audio payload
         */
        requestBody: AudioExtractIn,
    }): CancelablePromise<TaskOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-processing/video/extract-audio',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Media upload not found`,
                422: `Missing or malformed upload_id`,
                500: `Internal error`,
            },
        });
    }
}
