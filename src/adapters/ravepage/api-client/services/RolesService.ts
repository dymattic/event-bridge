/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupRoleAssignmentOut } from '../models/GroupRoleAssignmentOut';
import type { GroupRoleCreateIn } from '../models/GroupRoleCreateIn';
import type { GroupRoleOut } from '../models/GroupRoleOut';
import type { GroupRoleSyncReportOut } from '../models/GroupRoleSyncReportOut';
import type { GroupRoleUpdateIn } from '../models/GroupRoleUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RolesService {
    /**
     * Remove a role from a group member
     * Revokes `role_id` from `user_id`. Idempotent - 204
     * even when no assignment row existed. The Go port
     * does NOT push the revoke to VRChat; defer pending
     * the vrchat-link cross-worker contract.
     * @returns void
     * @throws ApiError
     */
    public static removeRoleFromMember({
        groupId,
        userId,
        roleId,
    }: {
        /**
         * Group ID
         */
        groupId: any,
        /**
         * Target user ID
         */
        userId: any,
        /**
         * Role UUID
         */
        roleId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/groups/{group_id}/members/{user_id}/roles/{role_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
                'role_id': roleId,
            },
            errors: {
                401: `Authentication required`,
                403: `Group admin required`,
                404: `Group or role not found`,
            },
        });
    }
    /**
     * Assign a role to a group member
     * Grants `role_id` to `user_id` within this group.
     * Idempotent - re-assigning returns the existing row
     * with 200.
     * @returns GroupRoleAssignmentOut OK
     * @throws ApiError
     */
    public static assignRoleToMember({
        groupId,
        userId,
        roleId,
    }: {
        /**
         * Group ID
         */
        groupId: any,
        /**
         * Target user ID
         */
        userId: any,
        /**
         * Role UUID
         */
        roleId: any,
    }): CancelablePromise<GroupRoleAssignmentOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/groups/{group_id}/members/{user_id}/roles/{role_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
                'role_id': roleId,
            },
            errors: {
                401: `Authentication required`,
                403: `Group admin required`,
                404: `Group, role, or target user not found`,
            },
        });
    }
    /**
     * Create an app-only group role
     * Creates a Rave.Page-side role
     * (`mirrored_from_vrchat=false`). Caller must be a
     * group admin/owner/manager or platform admin.
     * @returns GroupRoleOut Created
     * @throws ApiError
     */
    public static createGroupRole({
        groupId,
        requestBody,
    }: {
        /**
         * Group ID (UUID or grp_<uuid>)
         */
        groupId: any,
        /**
         * Role payload
         */
        requestBody: GroupRoleCreateIn,
    }): CancelablePromise<GroupRoleOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/groups/{group_id}/roles',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Group admin required`,
                404: `Group not found`,
                409: `Role name already exists`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Sync roles from linked VRChat group
     * Calls the vrchat worker via the
     * group-roles contract; upserts mirrored rows into
     * `group_roles`; sweeps stale mirrors; returns the
     * per-group report (created / updated / removed /
     * untouched_app_only).
     * @returns GroupRoleSyncReportOut OK
     * @throws ApiError
     */
    public static syncGroupRolesFromVrchat({
        groupId,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
    }): CancelablePromise<GroupRoleSyncReportOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/groups/{group_id}/roles/sync',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group_id`,
                401: `Authentication required`,
                403: `Group admin required`,
                404: `Group not found`,
                422: `Group not linked to a VRChat group`,
                502: `Upstream VRChat call failed`,
                503: `No active VRChat bot assigned`,
            },
        });
    }
    /**
     * Delete a group role
     * Idempotent - succeeds with 204 even when the role
     * does not exist. For mirrored roles the row is removed
     * locally only; the next sync recreates it unless the
     * upstream VRChat role is also deleted.
     * @returns void
     * @throws ApiError
     */
    public static deleteGroupRole({
        groupId,
        roleId,
    }: {
        /**
         * Group ID
         */
        groupId: any,
        /**
         * Role UUID
         */
        roleId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/groups/{group_id}/roles/{role_id}',
            path: {
                'group_id': groupId,
                'role_id': roleId,
            },
            errors: {
                401: `Authentication required`,
                403: `Group admin required`,
                404: `Group not found`,
            },
        });
    }
    /**
     * Update a group role
     * Updates a role. For mirrored roles, only `color` and
     * `position` should be changed locally - other fields
     * are overwritten on the next VRChat sync.
     * @returns GroupRoleOut OK
     * @throws ApiError
     */
    public static updateGroupRole({
        groupId,
        roleId,
        requestBody,
    }: {
        /**
         * Group ID
         */
        groupId: any,
        /**
         * Role UUID
         */
        roleId: any,
        /**
         * Role patch payload
         */
        requestBody: GroupRoleUpdateIn,
    }): CancelablePromise<GroupRoleOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/groups/{group_id}/roles/{role_id}',
            path: {
                'group_id': groupId,
                'role_id': roleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Group admin required`,
                404: `Group or role not found`,
                409: `Role name already exists`,
            },
        });
    }
}
