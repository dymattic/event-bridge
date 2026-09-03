/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActiveStreamOut } from '../models/ActiveStreamOut';
import type { LiveMatchSummaryOut } from '../models/LiveMatchSummaryOut';
import type { NowPlayingSnapshotOut } from '../models/NowPlayingSnapshotOut';
import type { SetLogResponseOut } from '../models/SetLogResponseOut';
import type { StreamPublishIn } from '../models/StreamPublishIn';
import type { StreamPublishOut } from '../models/StreamPublishOut';
import type { StreamTracklistOut } from '../models/StreamTracklistOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StreamsService {
    /**
     * Get now-playing track
     * Returns the now-playing snapshot for a stream's set-log.
     * @returns NowPlayingSnapshotOut OK
     * @throws ApiError
     */
    public static getLiveStreamNowPlaying({
        streamId,
    }: {
        /**
         * Stream ID
         */
        streamId: any,
    }): CancelablePromise<NowPlayingSnapshotOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/streams/{stream_id}/now-playing',
            path: {
                'stream_id': streamId,
            },
            errors: {
                404: `Stream not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Publish/update a recorded set
     * Owner-only mutation: set a recorded set's visibility
     * and/or associate it with an event. At least one of
     * `visibility` / `event_id` must be present. Non-owners
     * receive 404 (BOLA-safe - never 403).
     * @returns StreamPublishOut OK
     * @throws ApiError
     */
    public static setStreamPublish({
        streamId,
        requestBody,
    }: {
        /**
         * Stream ID (strm_<uuid> or bare UUID)
         */
        streamId: any,
        /**
         * Publish fields
         */
        requestBody: StreamPublishIn,
    }): CancelablePromise<StreamPublishOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/streams/{stream_id}/publish',
            path: {
                'stream_id': streamId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Authentication required`,
                404: `Stream not found or caller not the owner`,
                422: `Empty body or invalid visibility/event_id`,
            },
        });
    }
    /**
     * Get stream set-log
     * Returns the chronological track-detection log for a stream.
     * @returns SetLogResponseOut OK
     * @throws ApiError
     */
    public static getLiveStreamSetLog({
        streamId,
    }: {
        /**
         * Stream ID
         */
        streamId: any,
    }): CancelablePromise<SetLogResponseOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/streams/{stream_id}/set-log',
            path: {
                'stream_id': streamId,
            },
            errors: {
                404: `Stream not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get set-log entry match
     * Returns track-match candidates for a set-log entry.
     * @returns LiveMatchSummaryOut OK
     * @throws ApiError
     */
    public static getLiveStreamSetLogMatch({
        streamId,
        entryId,
    }: {
        /**
         * Stream ID
         */
        streamId: any,
        /**
         * Set-log entry ID
         */
        entryId: any,
    }): CancelablePromise<LiveMatchSummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/streams/{stream_id}/set-log/{entry_id}/match',
            path: {
                'stream_id': streamId,
                'entry_id': entryId,
            },
            errors: {
                404: `Entry not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get a set's derived tracklist
     * Returns the tracklist DERIVED from the live-ingest play
     * log for a stream's set. Anonymous-public: anyone who can
     * see the set sees its tracklist. Each entry carries the
     * hydrated canonical track (artists + provider links) with
     * the raw library metadata as the unlinked fallback.
     * @returns StreamTracklistOut OK
     * @throws ApiError
     */
    public static getStreamTracklist({
        streamId,
        limit,
        offset,
    }: {
        /**
         * Stream ID (strm_<uuid> or bare UUID)
         */
        streamId: any,
        /**
         * Max tracks (1-500, default 200)
         */
        limit?: any,
        /**
         * Page offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<StreamTracklistOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/streams/{stream_id}/tracklist',
            path: {
                'stream_id': streamId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                404: `Stream not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get a user's active stream
     * Returns the currently-active Cloudflare Stream for a user, if any.
     * @returns ActiveStreamOut OK
     * @throws ApiError
     */
    public static getUserActiveLiveStream({
        userId,
    }: {
        /**
         * User ID
         */
        userId: any,
    }): CancelablePromise<ActiveStreamOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}/active-stream',
            path: {
                'user_id': userId,
            },
            errors: {
                404: `No active stream`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
