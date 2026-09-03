/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActionCatalog } from '../models/ActionCatalog';
import type { ActionPage } from '../models/ActionPage';
import type { AuditPermissionCatalog } from '../models/AuditPermissionCatalog';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuditService {
    /**
     * List audit actions catalog
     * Returns the catalog of every registered audit action.
     * @returns ActionCatalog OK
     * @throws ApiError
     */
    public static listAuditActions(): CancelablePromise<ActionCatalog> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/audit/actions',
        });
    }
    /**
     * List audit permissions catalog
     * Returns the catalog of audit permission keys.
     * @returns AuditPermissionCatalog OK
     * @throws ApiError
     */
    public static listAuditPermissions(): CancelablePromise<AuditPermissionCatalog> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/audit/permissions',
        });
    }
    /**
     * List event audit log
     * Returns audit log entries for an event (organizer-only).
     * @returns ActionPage OK
     * @throws ApiError
     */
    public static listEventAudit({
        eventId,
        skip,
        limit,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Pagination offset
         */
        skip?: any,
        /**
         * Page size
         */
        limit?: any,
    }): CancelablePromise<ActionPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/audit',
            path: {
                'event_id': eventId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Event not found`,
            },
        });
    }
    /**
     * List group audit log
     * Returns audit log entries for a group (owner/admin-only).
     * @returns ActionPage OK
     * @throws ApiError
     */
    public static listGroupAudit({
        groupId,
        skip,
        limit,
    }: {
        /**
         * Group ID
         */
        groupId: any,
        /**
         * Pagination offset
         */
        skip?: any,
        /**
         * Page size
         */
        limit?: any,
    }): CancelablePromise<ActionPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/audit',
            path: {
                'group_id': groupId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Group not found`,
            },
        });
    }
    /**
     * Get group audit permissions
     * Returns audit permissions the caller has on this group.
     * @returns AuditPermissionCatalog OK
     * @throws ApiError
     */
    public static getMyEffectiveAuditPermissionsInGroup({
        groupId,
    }: {
        /**
         * Group ID
         */
        groupId: any,
    }): CancelablePromise<AuditPermissionCatalog> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/audit/permissions',
            path: {
                'group_id': groupId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Group not found`,
            },
        });
    }
    /**
     * List my audit log
     * Returns audit log entries scoped to the authenticated user.
     * @returns ActionPage OK
     * @throws ApiError
     */
    public static listMyAudit({
        skip,
        limit,
    }: {
        /**
         * Pagination offset
         */
        skip?: any,
        /**
         * Page size
         */
        limit?: any,
    }): CancelablePromise<ActionPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/audit',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
}
