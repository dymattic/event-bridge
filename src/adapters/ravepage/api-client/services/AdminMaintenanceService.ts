/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminMaintenanceCreateIn } from '../models/AdminMaintenanceCreateIn';
import type { AdminMaintenanceDetailOut } from '../models/AdminMaintenanceDetailOut';
import type { AdminMaintenanceListOut } from '../models/AdminMaintenanceListOut';
import type { AdminMaintenancePatchIn } from '../models/AdminMaintenancePatchIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminMaintenanceService {
    /**
     * List maintenance windows
     * Admin-only. Returns windows soonest-scheduled-first. Filterable by lifecycle status via `?status=scheduled|in_progress|completed|cancelled`. Offset-paginated via `?limit=` (1..200, default 50) and `?offset=` (default 0).
     * @returns AdminMaintenanceListOut OK
     * @throws ApiError
     */
    public static listAdminMaintenanceWindows({
        status,
        limit,
        offset,
    }: {
        /**
         * Filter to one lifecycle state
         */
        status?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Pagination offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<AdminMaintenanceListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/maintenance',
            query: {
                'status': status,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Validation failed`,
                500: `Maintenance unavailable`,
            },
        });
    }
    /**
     * Schedule a maintenance window
     * Admin-only. Creates a new window in `scheduled` state. Returns 201 + full detail.
     * @returns AdminMaintenanceDetailOut Created
     * @throws ApiError
     */
    public static createAdminMaintenanceWindow({
        requestBody,
    }: {
        /**
         * Window details
         */
        requestBody: AdminMaintenanceCreateIn,
    }): CancelablePromise<AdminMaintenanceDetailOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/maintenance',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Validation failed`,
                500: `Maintenance unavailable`,
            },
        });
    }
    /**
     * Get one maintenance window
     * Admin-only. Returns the full detail shape for a single window.
     * @returns AdminMaintenanceDetailOut OK
     * @throws ApiError
     */
    public static getAdminMaintenanceWindow({
        windowId,
    }: {
        /**
         * Window id (`mw_<uuid>` or bare uuid)
         */
        windowId: any,
    }): CancelablePromise<AdminMaintenanceDetailOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/maintenance/{window_id}',
            path: {
                'window_id': windowId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Maintenance window not found`,
                500: `Maintenance unavailable`,
            },
        });
    }
    /**
     * Edit maintenance-window metadata
     * Admin-only. Partial update - all body fields optional. Status changes go through the dedicated start/complete/cancel endpoints so the `actual_*` side effects are explicit at the call site.
     * @returns AdminMaintenanceDetailOut OK
     * @throws ApiError
     */
    public static patchAdminMaintenanceWindow({
        windowId,
        requestBody,
    }: {
        /**
         * Window id
         */
        windowId: any,
        /**
         * Partial update
         */
        requestBody: AdminMaintenancePatchIn,
    }): CancelablePromise<AdminMaintenanceDetailOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/maintenance/{window_id}',
            path: {
                'window_id': windowId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Maintenance window not found`,
                422: `Validation failed`,
                500: `Maintenance unavailable`,
            },
        });
    }
    /**
     * Abandon a maintenance window
     * Admin-only. Transitions to `cancelled` (terminal). Allowed from `scheduled` or `in_progress`. Returns 409 from `completed`.
     * @returns AdminMaintenanceDetailOut OK
     * @throws ApiError
     */
    public static cancelAdminMaintenanceWindow({
        windowId,
    }: {
        /**
         * Window id
         */
        windowId: any,
    }): CancelablePromise<AdminMaintenanceDetailOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/maintenance/{window_id}/cancel',
            path: {
                'window_id': windowId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Maintenance window not found`,
                409: `Cannot cancel a completed window`,
                500: `Maintenance unavailable`,
            },
        });
    }
    /**
     * Mark a window as completed
     * Admin-only. Transitions to `completed`. Sets `actual_end`. Allowed from `scheduled` (retrospective bookkeeping) or `in_progress`. Returns 409 from `cancelled`.
     * @returns AdminMaintenanceDetailOut OK
     * @throws ApiError
     */
    public static completeAdminMaintenanceWindow({
        windowId,
    }: {
        /**
         * Window id
         */
        windowId: any,
    }): CancelablePromise<AdminMaintenanceDetailOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/maintenance/{window_id}/complete',
            path: {
                'window_id': windowId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Maintenance window not found`,
                409: `Cannot complete a cancelled window`,
                500: `Maintenance unavailable`,
            },
        });
    }
    /**
     * Mark a window as in-progress
     * Admin-only. Transitions `scheduled` → `in_progress`. Sets `actual_start`. Idempotent on already-`in_progress`. Returns 409 from `completed`/`cancelled`.
     * @returns AdminMaintenanceDetailOut OK
     * @throws ApiError
     */
    public static startAdminMaintenanceWindow({
        windowId,
    }: {
        /**
         * Window id
         */
        windowId: any,
    }): CancelablePromise<AdminMaintenanceDetailOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/maintenance/{window_id}/start',
            path: {
                'window_id': windowId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Maintenance window not found`,
                409: `Cannot start from terminal state`,
                500: `Maintenance unavailable`,
            },
        });
    }
}
