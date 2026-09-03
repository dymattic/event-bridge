/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RefreshCacheOut } from '../models/RefreshCacheOut';
import type { YouTubeChannelOut } from '../models/YouTubeChannelOut';
import type { YouTubeCommentsOut } from '../models/YouTubeCommentsOut';
import type { YouTubeVideoCacheOut } from '../models/YouTubeVideoCacheOut';
import type { YouTubeVideoOut } from '../models/YouTubeVideoOut';
import type { YouTubeVideosOut } from '../models/YouTubeVideosOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExternalYoutubeService {
    /**
     * Get YouTube channel
     * Returns YouTube channel info. With OAuth token → authenticated user's channel; with `channel_id` query → that specific channel.
     * @returns YouTubeChannelOut OK
     * @throws ApiError
     */
    public static getYouTubeChannel({
        channelId,
    }: {
        /**
         * Specific YouTube channel ID (skip for the authed user's channel)
         */
        channelId?: any,
    }): CancelablePromise<YouTubeChannelOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/youtube/channel',
            query: {
                'channel_id': channelId,
            },
            errors: {
                400: `YOUTUBE_NOT_LINKED - no token AND no channel_id`,
                401: `Authentication required or YOUTUBE_TOKEN_EXPIRED`,
                404: `YouTube channel not found`,
                429: `YouTube rate limited / quota exceeded`,
                502: `YouTube upstream failure`,
                503: `YouTube not configured`,
            },
        });
    }
    /**
     * List videos for a YouTube channel
     * Returns paginated videos for a YouTube channel (uploads playlist).
     * @returns YouTubeVideosOut OK
     * @throws ApiError
     */
    public static getYouTubeChannelVideos({
        channelId,
        maxResults,
        pageToken,
        sort,
    }: {
        /**
         * YouTube channel ID
         */
        channelId: any,
        /**
         * Page size (1..50, default 10)
         */
        maxResults?: any,
        /**
         * Pagination token
         */
        pageToken?: any,
        /**
         * Order: date / rating / relevance / title / videoCount / viewCount
         */
        sort?: any,
    }): CancelablePromise<YouTubeVideosOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/youtube/channel/{channel_id}/videos',
            path: {
                'channel_id': channelId,
            },
            query: {
                'max_results': maxResults,
                'page_token': pageToken,
                'sort': sort,
            },
            errors: {
                401: `Authentication required or YOUTUBE_TOKEN_EXPIRED`,
                404: `YouTube channel not found`,
                422: `Invalid channel_id`,
                429: `YouTube rate limited / quota exceeded`,
                502: `YouTube upstream failure`,
                503: `YouTube not configured`,
            },
        });
    }
    /**
     * Refresh your YouTube videos cache
     * @returns RefreshCacheOut OK
     * @throws ApiError
     */
    public static refreshYouTubeCache(): CancelablePromise<RefreshCacheOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/external/youtube/me/refresh',
            errors: {
                400: `User has no YouTube link`,
                401: `Authentication required or YOUTUBE_TOKEN_EXPIRED`,
                429: `YouTube rate limited / quota exceeded`,
                502: `YouTube upstream failure`,
            },
        });
    }
    /**
     * Get authenticated user's YouTube videos
     * Paginated videos from the caller's own YouTube channel.
     * @returns YouTubeVideosOut OK
     * @throws ApiError
     */
    public static getYouTubeMyVideos({
        maxResults,
        pageToken,
        sort,
    }: {
        /**
         * Page size (1..50, default 20)
         */
        maxResults?: any,
        /**
         * Pagination token
         */
        pageToken?: any,
        /**
         * Order: date / rating / relevance / title / videoCount / viewCount
         */
        sort?: any,
    }): CancelablePromise<YouTubeVideosOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/youtube/me/videos',
            query: {
                'max_results': maxResults,
                'page_token': pageToken,
                'sort': sort,
            },
            errors: {
                400: `User has no YouTube link`,
                401: `Authentication required or YOUTUBE_TOKEN_EXPIRED`,
                404: `No YouTube channel found for user`,
                429: `YouTube rate limited / quota exceeded`,
                502: `YouTube upstream failure`,
            },
        });
    }
    /**
     * Search YouTube videos
     * Paginated YouTube video search.
     * @returns YouTubeVideosOut OK
     * @throws ApiError
     */
    public static searchYouTubeVideos({
        query,
        maxResults,
        pageToken,
        sort,
    }: {
        /**
         * Search query
         */
        query: any,
        /**
         * Page size (1..50, default 10)
         */
        maxResults?: any,
        /**
         * Pagination token
         */
        pageToken?: any,
        /**
         * Order: date / rating / relevance / title / videoCount / viewCount
         */
        sort?: any,
    }): CancelablePromise<YouTubeVideosOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/youtube/search',
            query: {
                'query': query,
                'max_results': maxResults,
                'page_token': pageToken,
                'sort': sort,
            },
            errors: {
                400: `Missing query or invalid input`,
                401: `Authentication required`,
                429: `YouTube rate limited / quota exceeded`,
                502: `YouTube upstream failure`,
                503: `YouTube not configured`,
            },
        });
    }
    /**
     * Get YouTube video details
     * Returns video details. Private videos visible only to the channel owner.
     * @returns YouTubeVideoOut OK
     * @throws ApiError
     */
    public static getYoutubeVideoDetails({
        videoId,
    }: {
        /**
         * YouTube video ID
         */
        videoId: any,
    }): CancelablePromise<YouTubeVideoOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/youtube/videos/{video_id}',
            path: {
                'video_id': videoId,
            },
            errors: {
                401: `Authentication required or YOUTUBE_TOKEN_EXPIRED`,
                403: `Video is private and caller is not the owner`,
                404: `Video not found`,
                422: `Invalid video_id`,
                429: `YouTube rate limited / quota exceeded`,
                502: `YouTube upstream failure`,
                503: `YouTube not configured`,
            },
        });
    }
    /**
     * Cached YouTube video detail
     * Returns the locally cached YouTube video plus the IDs of the tracklists that reference it. video_id is tried as a local cache UUID first (when it parses as one), then as a YouTube video ID. Pure cache read - never calls YouTube. Anonymous-public, the SoundCloud `/external/soundcloud/tracks/{track_id}` twin. Videos YouTube marks private are 404, not 403.
     * @returns YouTubeVideoCacheOut OK
     * @throws ApiError
     */
    public static getYouTubeVideoCacheDetails({
        videoId,
    }: {
        /**
         * YouTube video ID OR local cache UUID
         */
        videoId: any,
    }): CancelablePromise<YouTubeVideoCacheOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/youtube/videos/{video_id}/cache',
            path: {
                'video_id': videoId,
            },
            errors: {
                400: `Invalid video_id format`,
                404: `Video not in cache`,
                500: `Cache read failed`,
            },
        });
    }
    /**
     * List YouTube video comments
     * Paginated top-level YouTube comments.
     * @returns YouTubeCommentsOut OK
     * @throws ApiError
     */
    public static getYouTubeVideoComments({
        videoId,
        limit,
        cursor,
    }: {
        /**
         * YouTube video ID
         */
        videoId: any,
        /**
         * Page size (1..100, default 50)
         */
        limit?: any,
        /**
         * Pagination cursor (YouTube page token)
         */
        cursor?: any,
    }): CancelablePromise<YouTubeCommentsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/youtube/videos/{video_id}/comments',
            path: {
                'video_id': videoId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Authentication required`,
                403: `Comments disabled on this video`,
                404: `Video not found`,
                422: `Invalid video_id`,
                429: `YouTube rate limited / quota exceeded`,
                502: `YouTube upstream failure`,
                503: `YouTube not configured`,
            },
        });
    }
}
