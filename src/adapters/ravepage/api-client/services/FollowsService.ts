/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FollowerListOut } from '../models/FollowerListOut';
import type { FollowingListOut } from '../models/FollowingListOut';
import type { FollowStatusOut } from '../models/FollowStatusOut';
import type { FollowToggleOut } from '../models/FollowToggleOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FollowsService {
    /**
     * List entities I follow
     * Returns a paginated list of all entities the
     * authenticated caller is following. Newest-first.
     * Supports optional entity_type filter and skip/limit
     * pagination (default 0/50, max limit 200).
     * @returns FollowingListOut OK
     * @throws ApiError
     */
    public static listMyFollowing({
        entityType,
        skip,
        limit,
    }: {
        /**
         * Filter by entity type (user|group|performer|event|label)
         */
        entityType?: any,
        /**
         * Pagination skip (default 0)
         */
        skip?: any,
        /**
         * Pagination limit (default 50, max 200)
         */
        limit?: any,
    }): CancelablePromise<FollowingListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/follows/me/following',
            query: {
                'entity_type': entityType,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid entity_type filter or pagination bounds`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unfollow an entity
     * Unfollow a user, group, performer, event, or label.
     * Idempotent - safe to call when not currently
     * following.
     * @returns FollowToggleOut OK
     * @throws ApiError
     */
    public static unfollowEntity({
        entityType,
        entityId,
    }: {
        /**
         * Entity kind (user | group | performer | event | label)
         */
        entityType: any,
        /**
         * Entity UUID
         */
        entityId: any,
    }): CancelablePromise<FollowToggleOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/follows/{entity_type}/{entity_id}',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid entity_type or entity_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get follower count and caller follow status
     * Returns the follower count for the given entity, whether
     * the authenticated caller follows it (`following`), and -
     * for `entity_type=user` - whether that user follows the
     * caller back (`followed_by`).
     * `following && followed_by` is MUTUAL FOLLOW, which is the
     * precondition for sending a friend request: POST
     * /friends/{user_id} refuses with 409 MUTUAL_FOLLOW_REQUIRED
     * otherwise. Use the pair to decide whether to offer the
     * action; the server enforces it either way.
     * `followed_by` is always false for non-user entity types
     * (a group does not follow people) and for anonymous
     * callers, who also receive following=false.
     * @returns FollowStatusOut OK
     * @throws ApiError
     */
    public static getFollowStatus({
        entityType,
        entityId,
    }: {
        /**
         * Entity kind (user | group | performer | event | label)
         */
        entityType: any,
        /**
         * Entity UUID
         */
        entityId: any,
    }): CancelablePromise<FollowStatusOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/follows/{entity_type}/{entity_id}',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            errors: {
                422: `Invalid entity_type or entity_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Follow an entity
     * Follow a user, group, performer, event, or label.
     * Idempotent - calling again while already following
     * returns the current state without raising an error.
     * @returns FollowToggleOut OK
     * @throws ApiError
     */
    public static followEntity({
        entityType,
        entityId,
    }: {
        /**
         * Entity kind (user | group | performer | event | label)
         */
        entityType: any,
        /**
         * Entity UUID
         */
        entityId: any,
    }): CancelablePromise<FollowToggleOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/follows/{entity_type}/{entity_id}',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid entity_type or entity_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List followers of an entity
     * Returns a paginated list of users following the
     * given entity. Public endpoint - no authentication
     * required.
     * @returns FollowerListOut OK
     * @throws ApiError
     */
    public static listFollowers({
        entityType,
        entityId,
        skip,
        limit,
    }: {
        /**
         * Entity kind (user | group | performer | event | label)
         */
        entityType: any,
        /**
         * Entity UUID
         */
        entityId: any,
        /**
         * Pagination skip (default 0)
         */
        skip?: any,
        /**
         * Pagination limit (default 50, max 200)
         */
        limit?: any,
    }): CancelablePromise<FollowerListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/follows/{entity_type}/{entity_id}/followers',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Invalid entity_type, entity_id, or pagination bounds`,
                500: `Internal error`,
            },
        });
    }
}
