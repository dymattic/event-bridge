/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudFeedOut } from '../models/SoundCloudFeedOut';
import type { YouTubeFeedOut } from '../models/YouTubeFeedOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeedsService {
    /**
     * Latest SoundCloud tracks for a user
     * Anonymous-public. soundcloud.com egress
     * allowlist).
     * @returns SoundCloudFeedOut OK
     * @throws ApiError
     */
    public static getSoundcloudFeed({
        userId,
        limit,
    }: {
        /**
         * SoundCloud user ID
         */
        userId: any,
        /**
         * Page size (1..50, default 6)
         */
        limit?: any,
    }): CancelablePromise<SoundCloudFeedOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/soundcloud',
            query: {
                'user_id': userId,
                'limit': limit,
            },
            errors: {
                422: `Missing user_id or invalid limit`,
            },
        });
    }
    /**
     * Latest YouTube uploads for a channel
     * Anonymous-public. com
     * egress allowlist).
     * @returns YouTubeFeedOut OK
     * @throws ApiError
     */
    public static getYoutubeFeed({
        channelId,
        limit,
    }: {
        /**
         * YouTube channel ID
         */
        channelId: any,
        /**
         * Page size (1..50, default 6)
         */
        limit?: any,
    }): CancelablePromise<YouTubeFeedOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/youtube',
            query: {
                'channel_id': channelId,
                'limit': limit,
            },
            errors: {
                422: `Missing channel_id or invalid limit`,
            },
        });
    }
}
