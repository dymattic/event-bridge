/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventPermissionConfigOut } from '../models/EventPermissionConfigOut';
import type { EventPermissionConfigUpdateIn } from '../models/EventPermissionConfigUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventPermissionsService {
    /**
     * Get event permission config for a group
     * Returns the per-group event-permission configuration.
     * Auto-creates a default row on first access. Caller must
     * be a group owner/admin OR a platform admin; non-
     * authorized callers receive 404 (BOLA-safe).
     * @returns EventPermissionConfigOut OK
     * @throws ApiError
     */
    public static getEventPermissionConfig({
        groupId,
    }: {
        /**
         * Group id (UUID or grp_<uuid>)
         */
        groupId: any,
    }): CancelablePromise<EventPermissionConfigOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/event-permissions',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group_id`,
                401: `Authentication required`,
                404: `Group not found OR caller not authorised`,
                503: `Membership-role adapter unavailable`,
            },
        });
    }
    /**
     * Update event permission config for a group
     * Applies the supplied patch onto the per-group event-
     * permission configuration. Auto-creates a default row
     * if missing before applying the patch. Only group
     * owners/admins (or platform admins) can mutate; non-
     * authorized callers receive 404 (BOLA-safe). All
     * request-body fields are optional - absent fields leave
     * the existing column untouched.
     * @returns EventPermissionConfigOut OK
     * @throws ApiError
     */
    public static updateEventPermissionConfig({
        groupId,
        requestBody,
    }: {
        /**
         * Group id (UUID or grp_<uuid>)
         */
        groupId: any,
        /**
         * Permission patch
         */
        requestBody: EventPermissionConfigUpdateIn,
    }): CancelablePromise<EventPermissionConfigOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/groups/{group_id}/event-permissions',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid group_id or request body`,
                401: `Authentication required`,
                404: `Group not found OR caller not authorised`,
                422: `Validation failed`,
                503: `Membership-role adapter unavailable`,
            },
        });
    }
}
