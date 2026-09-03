/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminActionOut } from '../models/AdminActionOut';
import type { AdminReasonIn } from '../models/AdminReasonIn';
import type { AdminUserOut } from '../models/AdminUserOut';
import type { BanIn } from '../models/BanIn';
import type { SuspendIn } from '../models/SuspendIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminUsersService {
    /**
     * List users (admin)
     * Admin-only paginated listing of every user row, with the
     * admin-projection wire shape (status, status_reason,
     * suspended_until, etc.).
     * @returns AdminUserOut OK
     * @throws ApiError
     */
    public static adminListUsers({
        search,
        status,
        isAdmin,
        skip,
        limit,
        sort,
    }: {
        /**
         * Substring match on username/email (>=2 chars)
         */
        search?: any,
        /**
         * Filter by status
         */
        status?: any,
        /**
         * Filter by admin flag
         */
        isAdmin?: any,
        /**
         * Pagination skip
         */
        skip?: any,
        /**
         * Pagination limit (1-200)
         */
        limit?: any,
        /**
         * Sort field; prefix with - for descending
         */
        sort?: any,
    }): CancelablePromise<Array<AdminUserOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users',
            query: {
                'search': search,
                'status': status,
                'is_admin': isAdmin,
                'skip': skip,
                'limit': limit,
                'sort': sort,
            },
            errors: {
                400: `Invalid query parameter`,
                401: `Authentication required`,
                403: `Admin only`,
            },
        });
    }
    /**
     * List admin actions taken against a user
     * Returns the audit-log rows for the target user (promote,
     * demote, suspend, unsuspend, ban, unban).
     * @returns AdminActionOut OK
     * @throws ApiError
     */
    public static adminListUserActions({
        userId,
        skip,
        limit,
    }: {
        /**
         * Target user id (UUID or usr_-prefixed)
         */
        userId: any,
        /**
         * Pagination skip
         */
        skip?: any,
        /**
         * Pagination limit
         */
        limit?: any,
    }): CancelablePromise<Array<AdminActionOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users/{user_id}/actions',
            path: {
                'user_id': userId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                400: `Invalid user_id`,
                401: `Authentication required`,
                403: `Admin only`,
                404: `User not found`,
            },
        });
    }
    /**
     * Permanently ban a user
     * Requires a reason. Refuses to ban an admin (demote first).
     * @returns AdminUserOut OK
     * @throws ApiError
     */
    public static adminBanUser({
        userId,
        requestBody,
    }: {
        /**
         * Target user id
         */
        userId: any,
        /**
         * Reason
         */
        requestBody: BanIn,
    }): CancelablePromise<AdminUserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users/{user_id}/ban',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Cannot target admin, invalid status transition`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `User not found`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Demote an admin to a regular user
     * Refuses when the target is the last active admin.
     * @returns AdminUserOut OK
     * @throws ApiError
     */
    public static adminDemoteUser({
        userId,
        requestBody,
    }: {
        /**
         * Target user id
         */
        userId: any,
        /**
         * Optional reason
         */
        requestBody?: AdminReasonIn,
    }): CancelablePromise<AdminUserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users/{user_id}/demote',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `User not an admin or last-active-admin guard`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `User not found`,
            },
        });
    }
    /**
     * Promote a user to admin
     * Optional `reason` field for audit trail. Refuses to
     * promote an already-admin or to target the actor's own
     * account.
     * @returns AdminUserOut OK
     * @throws ApiError
     */
    public static adminPromoteUser({
        userId,
        requestBody,
    }: {
        /**
         * Target user id
         */
        userId: any,
        /**
         * Optional reason
         */
        requestBody?: AdminReasonIn,
    }): CancelablePromise<AdminUserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users/{user_id}/promote',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `User not found`,
            },
        });
    }
    /**
     * Suspend a user
     * Requires a reason. Optional `until` (RFC3339 UTC) for a
     * time-bound suspension; omit for indefinite.
     * @returns AdminUserOut OK
     * @throws ApiError
     */
    public static adminSuspendUser({
        userId,
        requestBody,
    }: {
        /**
         * Target user id
         */
        userId: any,
        /**
         * Reason + optional until
         */
        requestBody: SuspendIn,
    }): CancelablePromise<AdminUserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users/{user_id}/suspend',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid 'until', missing reason, invalid status transition, or admin target`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `User not found`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Lift a user's ban
     * Returns the user to active status. Refuses when the
     * target was not banned.
     * @returns AdminUserOut OK
     * @throws ApiError
     */
    public static adminUnbanUser({
        userId,
        requestBody,
    }: {
        /**
         * Target user id
         */
        userId: any,
        /**
         * Optional reason
         */
        requestBody?: AdminReasonIn,
    }): CancelablePromise<AdminUserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users/{user_id}/unban',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid status transition`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `User not found`,
            },
        });
    }
    /**
     * Lift a user's suspension
     * Returns the user to active status. Refuses when the
     * target was not suspended.
     * @returns AdminUserOut OK
     * @throws ApiError
     */
    public static adminUnsuspendUser({
        userId,
        requestBody,
    }: {
        /**
         * Target user id
         */
        userId: any,
        /**
         * Optional reason
         */
        requestBody?: AdminReasonIn,
    }): CancelablePromise<AdminUserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users/{user_id}/unsuspend',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid status transition`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `User not found`,
            },
        });
    }
}
