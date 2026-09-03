/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { twitchAnnouncementInDTO } from '../models/twitchAnnouncementInDTO';
import type { TwitchChannelInfoOut } from '../models/TwitchChannelInfoOut';
import type { TwitchChatLogOut } from '../models/TwitchChatLogOut';
import type { twitchChatMessageInDTO } from '../models/twitchChatMessageInDTO';
import type { TwitchChattersOut } from '../models/TwitchChattersOut';
import type { TwitchClipsOut } from '../models/TwitchClipsOut';
import type { TwitchFollowersOut } from '../models/TwitchFollowersOut';
import type { TwitchIsLiveOut } from '../models/TwitchIsLiveOut';
import type { twitchModifyChannelInDTO } from '../models/twitchModifyChannelInDTO';
import type { TwitchRaidOut } from '../models/TwitchRaidOut';
import type { twitchRaidTrainCreateInDTO } from '../models/twitchRaidTrainCreateInDTO';
import type { TwitchRaidTrainListOut } from '../models/TwitchRaidTrainListOut';
import type { TwitchRaidTrainOut } from '../models/TwitchRaidTrainOut';
import type { twitchStartRaidInDTO } from '../models/twitchStartRaidInDTO';
import type { TwitchStreamAnalyticsOut } from '../models/TwitchStreamAnalyticsOut';
import type { TwitchStreamLogsOut } from '../models/TwitchStreamLogsOut';
import type { TwitchUserProfileOut } from '../models/TwitchUserProfileOut';
import type { TwitchVideosOut } from '../models/TwitchVideosOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TwitchService {
    /**
     * Get Twitch channel info
     * Returns channel info via Helix `/channels?broadcaster_id=`.
     * @returns TwitchChannelInfoOut OK
     * @throws ApiError
     */
    public static getTwitchChannel({
        broadcasterId,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
    }): CancelablePromise<TwitchChannelInfoOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/channel/{broadcaster_id}',
            path: {
                'broadcaster_id': broadcasterId,
            },
            errors: {
                400: `TWITCH_NOT_LINKED`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                404: `Channel not found`,
                422: `Invalid broadcaster_id`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Modify Twitch channel info (stream title / game / tags)
     * Updates channel info via Helix PATCH `/channels`. Returns 204 NO_CONTENT on success.
     * @returns void
     * @throws ApiError
     */
    public static modifyTwitchChannel({
        broadcasterId,
        requestBody,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
        /**
         * Channel updates
         */
        requestBody: twitchModifyChannelInDTO,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/twitch/channel/{broadcaster_id}',
            path: {
                'broadcaster_id': broadcasterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `TWITCH_NOT_LINKED or invalid body`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                403: `TWITCH_FORBIDDEN (not the broadcaster)`,
                422: `Invalid broadcaster_id`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Auto-set Twitch stream title from booking/event
     * Sets stream title via Helix PATCH `/channels`. Returns 204 NO_CONTENT on success.
     * @returns void
     * @throws ApiError
     */
    public static autoSetTwitchStreamTitle({
        broadcasterId,
        requestBody,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
        /**
         * Title / game / tags
         */
        requestBody: twitchModifyChannelInDTO,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/twitch/channel/{broadcaster_id}/auto-title',
            path: {
                'broadcaster_id': broadcasterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `TWITCH_NOT_LINKED or invalid body`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                422: `Invalid broadcaster_id`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Get Twitch channel followers
     * Returns channel followers via Helix `/channels/followers`. Requires moderator:read:followers scope.
     * @returns TwitchFollowersOut OK
     * @throws ApiError
     */
    public static getTwitchFollowers({
        broadcasterId,
        first,
        after,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
        /**
         * Page size (1..100, default 20)
         */
        first?: any,
        /**
         * Pagination cursor
         */
        after?: any,
    }): CancelablePromise<TwitchFollowersOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/channel/{broadcaster_id}/followers',
            path: {
                'broadcaster_id': broadcasterId,
            },
            query: {
                'first': first,
                'after': after,
            },
            errors: {
                400: `TWITCH_NOT_LINKED or invalid query`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                403: `TWITCH_FORBIDDEN (not moderator)`,
                422: `Invalid broadcaster_id`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Send a Twitch chat announcement
     * Sends an announcement via Helix POST `/chat/announcements`. Returns 204 NO_CONTENT.
     * @returns void
     * @throws ApiError
     */
    public static sendTwitchAnnouncement({
        broadcasterId,
        requestBody,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
        /**
         * Message + color
         */
        requestBody: twitchAnnouncementInDTO,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/twitch/chat/{broadcaster_id}/announcement',
            path: {
                'broadcaster_id': broadcasterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `TWITCH_NOT_LINKED or invalid body`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                403: `TWITCH_FORBIDDEN (not moderator)`,
                422: `Invalid broadcaster_id`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Get Twitch channel chatters
     * Returns channel chatters via Helix `/chat/chatters`. Requires moderator scope.
     * @returns TwitchChattersOut OK
     * @throws ApiError
     */
    public static getTwitchChatters({
        broadcasterId,
        first,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
        /**
         * Page size (1..1000, default 100)
         */
        first?: any,
    }): CancelablePromise<TwitchChattersOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/chat/{broadcaster_id}/chatters',
            path: {
                'broadcaster_id': broadcasterId,
            },
            query: {
                'first': first,
            },
            errors: {
                400: `TWITCH_NOT_LINKED or invalid query`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                403: `TWITCH_FORBIDDEN (not moderator)`,
                422: `Invalid broadcaster_id`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Get Twitch saved chat logs
     * Returns saved chat log entries. NOTE - Go port returns empty page .
     * @returns TwitchChatLogOut OK
     * @throws ApiError
     */
    public static getTwitchChatLogs({
        broadcasterId,
        streamLogId,
        limit,
        cursor,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
        /**
         * Optional stream log ID filter
         */
        streamLogId?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<TwitchChatLogOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/chat/{broadcaster_id}/logs',
            path: {
                'broadcaster_id': broadcasterId,
            },
            query: {
                'stream_log_id': streamLogId,
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                400: `TWITCH_NOT_LINKED or invalid query`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                422: `Invalid broadcaster_id`,
            },
        });
    }
    /**
     * Send a Twitch chat message
     * Sends a chat message via Helix POST `/chat/messages`. Returns 204 NO_CONTENT.
     * @returns void
     * @throws ApiError
     */
    public static sendTwitchChatMessage({
        broadcasterId,
        requestBody,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
        /**
         * Message text
         */
        requestBody: twitchChatMessageInDTO,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/twitch/chat/{broadcaster_id}/message',
            path: {
                'broadcaster_id': broadcasterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `TWITCH_NOT_LINKED or invalid body`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                403: `TWITCH_FORBIDDEN`,
                422: `Invalid broadcaster_id`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * List Twitch broadcaster clips
     * Returns broadcaster clips via Helix `/clips?broadcaster_id=`.
     * @returns TwitchClipsOut OK
     * @throws ApiError
     */
    public static getTwitchClips({
        broadcasterId,
        first,
        after,
        startedAt,
        endedAt,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
        /**
         * Page size (1..100, default 20)
         */
        first?: any,
        /**
         * Pagination cursor
         */
        after?: any,
        /**
         * RFC 3339 start filter
         */
        startedAt?: any,
        /**
         * RFC 3339 end filter
         */
        endedAt?: any,
    }): CancelablePromise<TwitchClipsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/clips/{broadcaster_id}',
            path: {
                'broadcaster_id': broadcasterId,
            },
            query: {
                'first': first,
                'after': after,
                'started_at': startedAt,
                'ended_at': endedAt,
            },
            errors: {
                400: `TWITCH_NOT_LINKED or invalid query`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                422: `Invalid broadcaster_id`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Get the authenticated Twitch user profile
     * Returns the authenticated caller's Twitch user profile via Helix `/users`.
     * @returns TwitchUserProfileOut OK
     * @throws ApiError
     */
    public static getTwitchMe(): CancelablePromise<TwitchUserProfileOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/me',
            errors: {
                400: `TWITCH_NOT_LINKED`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                429: `Twitch rate limited`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Cancel a pending Twitch raid
     * Cancels a pending raid via Helix DELETE `/raids`. Returns 204 NO_CONTENT.
     * @returns void
     * @throws ApiError
     */
    public static cancelTwitchRaid(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/twitch/raid',
            errors: {
                400: `TWITCH_NOT_LINKED`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                403: `TWITCH_FORBIDDEN`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Start a Twitch raid
     * Starts a raid via Helix POST `/raids`.
     * @returns TwitchRaidOut OK
     * @throws ApiError
     */
    public static startTwitchRaid({
        requestBody,
    }: {
        /**
         * Target broadcaster id
         */
        requestBody: twitchStartRaidInDTO,
    }): CancelablePromise<TwitchRaidOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/twitch/raid',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `TWITCH_NOT_LINKED or invalid body`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                403: `TWITCH_FORBIDDEN`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * List my Twitch raid trains
     * Returns raid trains owned by the authenticated caller (paginated).
     * @returns TwitchRaidTrainListOut OK
     * @throws ApiError
     */
    public static listTwitchRaidTrains({
        limit,
        cursor,
    }: {
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Opaque pagination cursor (ISO-8601 created_at)
         */
        cursor?: any,
    }): CancelablePromise<TwitchRaidTrainListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/raid-trains',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid limit/cursor`,
            },
        });
    }
    /**
     * Create a Twitch raid train
     * Creates a new raid train owned by the authenticated caller. Train + stops persisted atomically.
     * @returns TwitchRaidTrainOut Created
     * @throws ApiError
     */
    public static createTwitchRaidTrain({
        requestBody,
    }: {
        /**
         * Raid train + stops
         */
        requestBody: twitchRaidTrainCreateInDTO,
    }): CancelablePromise<TwitchRaidTrainOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/twitch/raid-trains',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Authentication required`,
                422: `Invalid body OR DUPLICATE_STOP_POSITION`,
            },
        });
    }
    /**
     * Get a Twitch raid train
     * Returns one raid train owned by the authenticated caller. 404 when not found OR not owner (BOLA-safe).
     * @returns TwitchRaidTrainOut OK
     * @throws ApiError
     */
    public static getTwitchRaidTrain({
        trainId,
    }: {
        /**
         * Raid train ID (UUID, with or without `trr_` prefix)
         */
        trainId: any,
    }): CancelablePromise<TwitchRaidTrainOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/raid-trains/{train_id}',
            path: {
                'train_id': trainId,
            },
            errors: {
                401: `Authentication required`,
                404: `Train not found OR not owner`,
                422: `Invalid train_id`,
            },
        });
    }
    /**
     * Execute a Twitch raid-train stop
     * Performs the Helix raid for one stop in the train owned by the authenticated caller. Auth-first BOLA gate. Idempotent - concurrent calls return 409.
     * @returns TwitchRaidOut OK
     * @throws ApiError
     */
    public static executeTwitchRaidTrainStop({
        trainId,
        stopId,
    }: {
        /**
         * Raid train ID (UUID, with or without `trr_` prefix)
         */
        trainId: any,
        /**
         * Raid stop ID (UUID)
         */
        stopId: any,
    }): CancelablePromise<TwitchRaidOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/twitch/raid-trains/{train_id}/stops/{stop_id}/execute',
            path: {
                'train_id': trainId,
                'stop_id': stopId,
            },
            errors: {
                400: `TWITCH_NOT_LINKED`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                404: `Train or stop not found OR not owner`,
                409: `Stop already executed (race or replay)`,
                422: `Invalid IDs`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Get Twitch stream analytics
     * Aggregated stream analytics. NOTE - Go port returns zero aggregates / empty recent_streams .
     * @returns TwitchStreamAnalyticsOut OK
     * @throws ApiError
     */
    public static getTwitchStreamAnalytics({
        broadcasterId,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
    }): CancelablePromise<TwitchStreamAnalyticsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/stream/{broadcaster_id}/analytics',
            path: {
                'broadcaster_id': broadcasterId,
            },
            errors: {
                400: `TWITCH_NOT_LINKED`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                422: `Invalid broadcaster_id`,
            },
        });
    }
    /**
     * Check if a Twitch broadcaster is live
     * Authed live check via Helix `/streams?user_id=`.
     * @returns TwitchIsLiveOut OK
     * @throws ApiError
     */
    public static isTwitchLive({
        broadcasterId,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
    }): CancelablePromise<TwitchIsLiveOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/stream/{broadcaster_id}/live',
            path: {
                'broadcaster_id': broadcasterId,
            },
            errors: {
                400: `TWITCH_NOT_LINKED`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                422: `Invalid broadcaster_id`,
                502: `Twitch upstream failure`,
            },
        });
    }
    /**
     * Get Twitch stream history logs
     * Returns historical stream logs. NOTE - Go port returns empty page .
     * @returns TwitchStreamLogsOut OK
     * @throws ApiError
     */
    public static getTwitchStreamLogs({
        broadcasterId,
        limit,
        cursor,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<TwitchStreamLogsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/stream/{broadcaster_id}/logs',
            path: {
                'broadcaster_id': broadcasterId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                400: `TWITCH_NOT_LINKED or invalid query`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                422: `Invalid broadcaster_id`,
            },
        });
    }
    /**
     * Public Twitch live-check by id or login
     * Public live check via app-access-token. broadcaster may be numeric id OR login name.
     * @returns TwitchIsLiveOut OK
     * @throws ApiError
     */
    public static isTwitchLivePublic({
        broadcaster,
    }: {
        /**
         * Twitch broadcaster id (numeric) or login
         */
        broadcaster: any,
    }): CancelablePromise<TwitchIsLiveOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/streams/{broadcaster}/live',
            path: {
                'broadcaster': broadcaster,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid broadcaster`,
                502: `Twitch upstream failure`,
                503: `TWITCH_UNAVAILABLE (credentials not configured)`,
            },
        });
    }
    /**
     * List Twitch broadcaster videos (VODs/highlights)
     * Returns broadcaster videos via Helix `/videos?user_id=`.
     * @returns TwitchVideosOut OK
     * @throws ApiError
     */
    public static getTwitchVideos({
        broadcasterId,
        first,
        after,
        videoType,
    }: {
        /**
         * Twitch broadcaster user id
         */
        broadcasterId: any,
        /**
         * Page size (1..100, default 20)
         */
        first?: any,
        /**
         * Pagination cursor
         */
        after?: any,
        /**
         * Filter (all|archive|highlight|upload). Default all.
         */
        videoType?: any,
    }): CancelablePromise<TwitchVideosOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/twitch/videos/{broadcaster_id}',
            path: {
                'broadcaster_id': broadcasterId,
            },
            query: {
                'first': first,
                'after': after,
                'video_type': videoType,
            },
            errors: {
                400: `TWITCH_NOT_LINKED or invalid query`,
                401: `Authentication required or TWITCH_AUTH_EXPIRED`,
                422: `Invalid broadcaster_id`,
                502: `Twitch upstream failure`,
            },
        });
    }
}
