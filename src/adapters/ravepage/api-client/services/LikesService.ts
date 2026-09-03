/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentLikeOut } from '../models/ContentLikeOut';
import type { LikeStatusOut } from '../models/LikeStatusOut';
import type { LikeToggleOut } from '../models/LikeToggleOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LikesService {
    /**
     * List my likes
     * Returns a paginated list of all content items liked
     * by the authenticated caller. Newest-first. Supports
     * optional content_type filter and skip/limit
     * pagination (default 0/50, max limit 200).
     * @returns ContentLikeOut OK
     * @throws ApiError
     */
    public static listMyLikes({
        contentType,
        skip,
        limit,
    }: {
        /**
         * Filter by content type
         */
        contentType?: any,
        /**
         * Pagination skip (default 0)
         */
        skip?: any,
        /**
         * Pagination limit (default 50, max 200)
         */
        limit?: any,
    }): CancelablePromise<Array<ContentLikeOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/likes/me',
            query: {
                'content_type': contentType,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid content_type filter or pagination bounds`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unlike a content item
     * Removes the like for the given content item.
     * Idempotent - safe to call when not currently liked.
     * @returns LikeToggleOut OK
     * @throws ApiError
     */
    public static unlikeContent({
        contentType,
        contentId,
    }: {
        /**
         * Content kind (see GET for valid values)
         */
        contentType: any,
        /**
         * Content UUID
         */
        contentId: any,
    }): CancelablePromise<LikeToggleOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/likes/{content_type}/{content_id}',
            path: {
                'content_type': contentType,
                'content_id': contentId,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid content_type or content_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get like status and count
     * Returns the total like count for a content item and
     * whether the authenticated caller has liked it.
     * Anonymous callers receive liked_by_me=false.
     * @returns LikeStatusOut OK
     * @throws ApiError
     */
    public static getLikeStatus({
        contentType,
        contentId,
    }: {
        /**
         * Content kind (event | media_upload | release | tracklist | performer | group | profile | workshop_preset | workshop_component)
         */
        contentType: any,
        /**
         * Content UUID
         */
        contentId: any,
    }): CancelablePromise<LikeStatusOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/likes/{content_type}/{content_id}',
            path: {
                'content_type': contentType,
                'content_id': contentId,
            },
            errors: {
                422: `Invalid content_type or content_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Like a content item
     * Adds a like for the given content item. Idempotent -
     * repeated calls return the current state without
     * raising an error.
     * @returns LikeToggleOut OK
     * @throws ApiError
     */
    public static likeContent({
        contentType,
        contentId,
    }: {
        /**
         * Content kind (see GET for valid values)
         */
        contentType: any,
        /**
         * Content UUID
         */
        contentId: any,
    }): CancelablePromise<LikeToggleOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/likes/{content_type}/{content_id}',
            path: {
                'content_type': contentType,
                'content_id': contentId,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid content_type or content_id`,
                500: `Internal error`,
            },
        });
    }
}
