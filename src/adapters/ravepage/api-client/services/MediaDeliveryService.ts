/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaInfoResponse } from '../models/MediaInfoResponse';
import type { SharedCollectionResponseOut } from '../models/SharedCollectionResponseOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MediaDeliveryService {
    /**
     * Get media info in event context
     * Returns metadata for a media file linked to an event.
     * Public/unlisted events serve to anyone; private events
     * 404 (BOLA-safe).
     * @returns MediaInfoResponse OK
     * @throws ApiError
     */
    public static getEventMediaInfo({
        eventId,
        uploadId,
    }: {
        /**
         * Event ID (UUID)
         */
        eventId: any,
        /**
         * Media upload ID (UUID)
         */
        uploadId: any,
    }): CancelablePromise<MediaInfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/info/{event_id}/{upload_id}',
            path: {
                'event_id': eventId,
                'upload_id': uploadId,
            },
            errors: {
                401: `Authentication required`,
                404: `Event or media not found`,
                422: `Malformed event_id / upload_id`,
            },
        });
    }
    /**
     * Stream event media
     * Stream a media file linked to an event. Public/unlisted
     * events serve to anyone; private events 404 (BOLA-safe).
     * Range requests supported.
     * @returns string Media bytes (whole object)
     * @throws ApiError
     */
    public static streamEventMedia({
        eventId,
        uploadId,
        range,
    }: {
        /**
         * Event ID (UUID)
         */
        eventId: any,
        /**
         * Media upload ID (UUID)
         */
        uploadId: any,
        /**
         * Byte range (e.g. bytes=0-1023)
         */
        range?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/stream/{event_id}/{upload_id}',
            path: {
                'event_id': eventId,
                'upload_id': uploadId,
            },
            headers: {
                'Range': range,
            },
            errors: {
                401: `Authentication required`,
                404: `Event or media not found`,
                410: `Media blob is gone`,
                416: `Range Not Satisfiable`,
                422: `Pipeline failed / invalid id`,
                451: `Media flagged by AV`,
                503: `Media still processing`,
            },
        });
    }
    /**
     * Stream event poster / cover image
     * Stream the event's primary poster (cover_media_upload_id)
     * via S3 with HTTP Range support. Public/unlisted events
     * serve the poster anonymously; private events 404
     * (BOLA-safe). Pipeline-state aware: 503 while processing,
     * 422 on failure, 451 on AV quarantine, 410 on tombstoned
     * blob.
     * @returns string Poster bytes (whole object)
     * @throws ApiError
     */
    public static streamEventPoster({
        eventId,
        range,
    }: {
        /**
         * Event ID (UUID)
         */
        eventId: any,
        /**
         * Byte range (e.g. bytes=0-1023)
         */
        range?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/poster/stream',
            path: {
                'event_id': eventId,
            },
            headers: {
                'Range': range,
            },
            errors: {
                404: `Event or poster not found`,
                410: `Media blob is gone`,
                416: `Range Not Satisfiable`,
                422: `Pipeline failed / invalid event_id`,
                451: `Media flagged by AV`,
                503: `Media still processing`,
            },
        });
    }
    /**
     * Get shared media collection
     * Anonymous read of a shareable media collection via token link.
     * @returns SharedCollectionResponseOut OK
     * @throws ApiError
     */
    public static getSharedMediaCollection({
        token,
    }: {
        /**
         * Share token
         */
        token: any,
    }): CancelablePromise<SharedCollectionResponseOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-collections/shared/{token}',
            path: {
                'token': token,
            },
            errors: {
                404: `Invalid or expired link`,
            },
        });
    }
    /**
     * Get media file info
     * Returns metadata for a media upload. Owner + admin
     * always have access; otherwise the upload must be
     * publicly attached (linked to a public/unlisted event).
     * @returns MediaInfoResponse OK
     * @throws ApiError
     */
    public static getMediaInfo({
        uploadId,
    }: {
        /**
         * Media upload ID (UUID)
         */
        uploadId: any,
    }): CancelablePromise<MediaInfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media/info/{upload_id}',
            path: {
                'upload_id': uploadId,
            },
            errors: {
                401: `Authentication required`,
                403: `Access denied`,
                404: `Media file not found`,
                422: `Malformed upload_id`,
            },
        });
    }
    /**
     * Stream media by upload ID
     * Stream a media file by upload ID. Owner / admin / public-
     * via-events access; anonymous allowed for public uploads.
     * Range requests supported.
     * @returns string Media bytes (whole object)
     * @throws ApiError
     */
    public static streamMedia({
        uploadId,
        range,
    }: {
        /**
         * Media upload ID (UUID)
         */
        uploadId: any,
        /**
         * Byte range (e.g. bytes=0-1023)
         */
        range?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media/stream/{upload_id}',
            path: {
                'upload_id': uploadId,
            },
            headers: {
                'Range': range,
            },
            errors: {
                401: `Authentication required`,
                403: `Access denied`,
                404: `Media not found`,
                410: `Media blob is gone`,
                416: `Range Not Satisfiable`,
                422: `Pipeline failed / invalid upload_id`,
                451: `Media flagged by AV`,
                503: `Media still processing`,
            },
        });
    }
}
