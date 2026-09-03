/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendshipListOut } from '../models/FriendshipListOut';
import type { FriendshipOut } from '../models/FriendshipOut';
import type { PendingRequestsOut } from '../models/PendingRequestsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FriendsService {
    /**
     * List accepted friends
     * Returns the authenticated caller's accepted
     * friendships, newest first. Supports skip/limit
     * pagination (default 0/50, max limit 200).
     * @returns FriendshipListOut OK
     * @throws ApiError
     */
    public static listFriends({
        skip,
        limit,
    }: {
        /**
         * Pagination skip (default 0)
         */
        skip?: any,
        /**
         * Pagination limit (default 50, max 200)
         */
        limit?: any,
    }): CancelablePromise<FriendshipListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/friends',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid pagination bounds`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List pending friend requests
     * Returns the caller's `{incoming, outgoing}`
     * pending friend requests. Incoming requests are
     * waiting on the caller's acceptance; outgoing ones
     * are waiting on the other side.
     * @returns PendingRequestsOut OK
     * @throws ApiError
     */
    public static listPendingFriendRequests(): CancelablePromise<PendingRequestsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/friends/requests',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Cancel or decline a pending friend request
     * Removes a pending friendship row involving the
     * caller and {user_id}. Applies whether the caller
     * is the sender (cancel) or the recipient (decline).
     * Idempotent - a 204 is returned even when no
     * pending row exists.
     * @returns void
     * @throws ApiError
     */
    public static cancelOrDeclineFriendRequest({
        userId,
    }: {
        /**
         * Other user (bare UUID or `usr_<uuid>`)
         */
        userId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/friends/requests/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                422: `Self-friendship attempt`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Send (or re-send) a friend request
     * Sends a friend request to {user_id}. Idempotent -
     * repeated calls return the current state. If the
     * other side already has a pending request out to
     * you, this accepts it (treats both-sides-requesting
     * as mutual). A fresh request REQUIRES that the caller
     * and the target already follow each other - the ladder
     * is follow -> mutual follow -> friend request ->
     * accepted. Without mutual follow the call is refused
     * with 409 `MUTUAL_FOLLOW_REQUIRED`, a distinct code
     * from the 409 `CONFLICT` used for block states so the
     * two are never conflated. Read mutual-follow state
     * first via GET /follows/user/{user_id}
     * (`following && followed_by`). The precondition applies
     * only when no friendship row exists yet, so an existing
     * friendship survives a later unfollow.
     * @returns FriendshipOut OK
     * @throws ApiError
     */
    public static sendFriendRequest({
        userId,
    }: {
        /**
         * Target user (bare UUID or `usr_<uuid>`)
         */
        userId: any,
    }): CancelablePromise<FriendshipOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/friends/requests/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                404: `User not found`,
                409: `MUTUAL_FOLLOW_REQUIRED (not mutual followers yet) or CONFLICT (block state)`,
                422: `Self-friendship attempt`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Accept a pending incoming friend request
     * Accepts an incoming friend request from
     * {user_id}. 404 when no pending row exists; 409
     * when the row is not pending or the caller was the
     * original requester.
     * @returns FriendshipOut OK
     * @throws ApiError
     */
    public static acceptFriendRequest({
        userId,
    }: {
        /**
         * Other user (bare UUID or `usr_<uuid>`)
         */
        userId: any,
    }): CancelablePromise<FriendshipOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/friends/requests/{user_id}/accept',
            path: {
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                404: `No friend request to accept`,
                409: `Cannot accept this request`,
                422: `Invalid request`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unfriend a user
     * Removes an accepted friendship between the caller
     * and {user_id}. Idempotent - a 204 is returned even
     * when no accepted row exists.
     * @returns void
     * @throws ApiError
     */
    public static unfriendUser({
        userId,
    }: {
        /**
         * Other user (bare UUID or `usr_<uuid>`)
         */
        userId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/friends/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                422: `Self-friendship attempt`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unblock a user
     * Removes a block the caller previously set on
     * {user_id}. Does not restore a prior friendship -
     * a fresh request must be sent to re-friend.
     * Idempotent.
     * @returns void
     * @throws ApiError
     */
    public static unblockUser({
        userId,
    }: {
        /**
         * Other user (bare UUID or `usr_<uuid>`)
         */
        userId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/friends/{user_id}/block',
            path: {
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                422: `Self-friendship attempt`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Block a user
     * Blocks {user_id}. Any existing pending or accepted
     * friendship is replaced with a blocked row owned by
     * the caller. 409 when the pair is already blocked
     * by the other party.
     * @returns FriendshipOut OK
     * @throws ApiError
     */
    public static blockUser({
        userId,
    }: {
        /**
         * Other user (bare UUID or `usr_<uuid>`)
         */
        userId: any,
    }): CancelablePromise<FriendshipOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/friends/{user_id}/block',
            path: {
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                409: `Already blocked by the other party`,
                422: `Self-friendship attempt`,
                500: `Internal error`,
            },
        });
    }
}
