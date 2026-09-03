/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClubOut } from '../models/ClubOut';
import type { GroupChatRoomIn } from '../models/GroupChatRoomIn';
import type { GroupChatRoomListOut } from '../models/GroupChatRoomListOut';
import type { GroupChatRoomOut } from '../models/GroupChatRoomOut';
import type { GroupChatRoomPatchIn } from '../models/GroupChatRoomPatchIn';
import type { GroupChatVisibilityIn } from '../models/GroupChatVisibilityIn';
import type { GroupChatVisibilityOut } from '../models/GroupChatVisibilityOut';
import type { GroupCreateIn } from '../models/GroupCreateIn';
import type { groupMediaBackgroundIn } from '../models/groupMediaBackgroundIn';
import type { groupMediaBackgroundOut } from '../models/groupMediaBackgroundOut';
import type { GroupMembershipIn } from '../models/GroupMembershipIn';
import type { GroupMembershipOut } from '../models/GroupMembershipOut';
import type { groupNotificationSettingsOut } from '../models/groupNotificationSettingsOut';
import type { GroupOut } from '../models/GroupOut';
import type { GroupProfileUpdateIn } from '../models/GroupProfileUpdateIn';
import type { GroupRoleAssignmentOut } from '../models/GroupRoleAssignmentOut';
import type { GroupRoleCreateIn } from '../models/GroupRoleCreateIn';
import type { GroupRoleOut } from '../models/GroupRoleOut';
import type { GroupRoleSyncReportOut } from '../models/GroupRoleSyncReportOut';
import type { GroupRoleUpdateIn } from '../models/GroupRoleUpdateIn';
import type { GroupTypeOut } from '../models/GroupTypeOut';
import type { GroupTypesReplaceIn } from '../models/GroupTypesReplaceIn';
import type { GroupUpdateIn } from '../models/GroupUpdateIn';
import type { groupUploadAssignmentOut } from '../models/groupUploadAssignmentOut';
import type { groupUploadListItem } from '../models/groupUploadListItem';
import type { GroupWithMembershipRoleOut } from '../models/GroupWithMembershipRoleOut';
import type { GroupWithMembersOut } from '../models/GroupWithMembersOut';
import type { ListEventsByGroupOut } from '../models/ListEventsByGroupOut';
import type { VRChatGroupLinkIn } from '../models/VRChatGroupLinkIn';
import type { VRChatGroupLinkOut } from '../models/VRChatGroupLinkOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GroupsService {
    /**
     * List groups
     * Anonymous-OK paginated list of groups.
     * @returns GroupOut OK
     * @throws ApiError
     */
    public static listGroups({
        skip,
        limit,
        family,
    }: {
        /**
         * Pagination offset
         */
        skip?: any,
        /**
         * Page size
         */
        limit?: any,
        /**
         * CSV of derived genre-family keys (e.g. 'House,Techno'). Returns groups whose genre_families include ANY listed family. Family keys are clustered labels, NOT taxonomy slugs.
         */
        family?: any,
    }): CancelablePromise<Array<GroupOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups',
            query: {
                'skip': skip,
                'limit': limit,
                'family': family,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Create group
     * Authenticated group creation. Caller becomes the owner.
     * @returns GroupOut Created
     * @throws ApiError
     */
    public static createGroup({
        requestBody,
    }: {
        /**
         * Group create payload
         */
        requestBody: GroupCreateIn,
    }): CancelablePromise<GroupOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/groups',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                409: `Name already registered`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * List my groups
     * Groups the caller is a member of, with their role.
     * @returns GroupWithMembershipRoleOut OK
     * @throws ApiError
     */
    public static getMyGroups({
        includeAll,
    }: {
        /**
         * Include memberships of every role (default: organizer-capable only)
         */
        includeAll?: any,
    }): CancelablePromise<Array<GroupWithMembershipRoleOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/mine',
            query: {
                'include_all': includeAll,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * List group types
     * Anonymous-OK catalogue of all group types.
     * @returns GroupTypeOut OK
     * @throws ApiError
     */
    public static listGroupTypes(): CancelablePromise<Array<GroupTypeOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/types',
        });
    }
    /**
     * Delete group
     * Only the group owner or a system admin can delete a group.
     * @returns void
     * @throws ApiError
     */
    public static deleteGroup({
        groupId,
    }: {
        /**
         * Group ID
         */
        groupId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/groups/{group_id}',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Not authorized`,
                404: `Group not found`,
            },
        });
    }
    /**
     * Get group by ID
     * Anonymous-OK single group read.
     * @returns GroupOut OK
     * @throws ApiError
     */
    public static getGroup({
        groupId,
    }: {
        /**
         * Group ID (UUID or grp_<uuid>)
         */
        groupId: any,
    }): CancelablePromise<GroupOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Bad Request`,
                404: `Group not found`,
            },
        });
    }
    /**
     * Update group
     * Patch-style update; only the group owner or admin may update.
     * @returns GroupOut OK
     * @throws ApiError
     */
    public static updateGroup({
        groupId,
        requestBody,
    }: {
        /**
         * Group ID
         */
        groupId: any,
        /**
         * Patch payload
         */
        requestBody: GroupUpdateIn,
    }): CancelablePromise<GroupOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/groups/{group_id}',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Not authorized`,
                404: `Group not found`,
                409: `Name already registered`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Toggle the main group chat-room visibility
     * Flips the group's MAIN Matrix planning room public (open-join + directory-listed) or private (invite-only). Organizer-only; applied asynchronously. Channels have their own toggle on PATCH /groups/{group_id}/chat/rooms/{room_id}.
     * @returns GroupChatVisibilityOut OK
     * @throws ApiError
     */
    public static setGroupChatVisibility({
        groupId,
        requestBody,
    }: {
        /**
         * Group id (grp_<uuid> or bare UUID)
         */
        groupId: any,
        /**
         * Visibility
         */
        requestBody: GroupChatVisibilityIn,
    }): CancelablePromise<GroupChatVisibilityOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/groups/{group_id}/chat',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / group_id`,
                401: `Authentication required`,
                404: `Group not found`,
                503: `Chat substrate unavailable`,
            },
        });
    }
    /**
     * List a group's chatrooms
     * Group members (any role) + platform admins see every channel; everyone else sees public channels only. Resolve each channel's Matrix room via GET /chat/rooms?for=group_channel:<id>.
     * @returns GroupChatRoomListOut OK
     * @throws ApiError
     */
    public static listGroupChatRooms({
        groupId,
    }: {
        /**
         * Group id (grp_<uuid> or bare UUID)
         */
        groupId: any,
    }): CancelablePromise<GroupChatRoomListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/chat/rooms',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group_id`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a group chatroom
     * Creates a named chat channel for the group and provisions its Matrix room (creator admin + current members invited, capped at 200; later joins converge automatically). Organizer-only (owner/admin/manager). Public channels are open-join + directory-listed and UNENCRYPTED; private channels are invite-only E2EE.
     * @returns GroupChatRoomOut Created
     * @throws ApiError
     */
    public static createGroupChatRoom({
        groupId,
        requestBody,
    }: {
        /**
         * Group id (grp_<uuid> or bare UUID)
         */
        groupId: any,
        /**
         * Channel
         */
        requestBody: GroupChatRoomIn,
    }): CancelablePromise<GroupChatRoomOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/groups/{group_id}/chat/rooms',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / group_id`,
                401: `Authentication required`,
                404: `Group not found`,
                409: `Name already in use`,
                422: `Validation failed`,
                503: `Chat substrate unavailable`,
            },
        });
    }
    /**
     * Update a group chatroom
     * Rename / retopic / toggle a channel public-private (the Matrix flip applies asynchronously). Organizer-only. Note: a channel created private stays E2EE even when opened - new joiners can't read pre-flip history.
     * @returns GroupChatRoomOut OK
     * @throws ApiError
     */
    public static updateGroupChatRoom({
        groupId,
        roomId,
        requestBody,
    }: {
        /**
         * Group id (grp_<uuid> or bare UUID)
         */
        groupId: any,
        /**
         * Channel id (gcr_<uuid> or bare UUID)
         */
        roomId: any,
        /**
         * Patch (≥1 field)
         */
        requestBody: GroupChatRoomPatchIn,
    }): CancelablePromise<GroupChatRoomOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/groups/{group_id}/chat/rooms/{room_id}',
            path: {
                'group_id': groupId,
                'room_id': roomId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / ids`,
                401: `Authentication required`,
                404: `Group or channel not found`,
                409: `Name already in use`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * List clubs owned by a group
     * Returns every club whose `group_id` matches.
     * Ordered by name. 404 if the group is
     * absent.
     * @returns ClubOut OK
     * @throws ApiError
     */
    public static listGroupClubs({
        groupId,
    }: {
        /**
         * Group ID (bare UUID or 'grp_<uuid>')
         */
        groupId: any,
    }): CancelablePromise<Array<ClubOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/clubs',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group_id`,
                404: `Group not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List events organised by a group
     * Returns visibility-filtered events
     * organised by the group (organizer_type='group' AND
     * organizer_id=group_id). Anonymous callers see only
     * public+unlisted; authed callers see those plus their
     * involved-events.
     * @returns ListEventsByGroupOut OK
     * @throws ApiError
     */
    public static listGroupEvents({
        groupId,
        limit,
        offset,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
        /**
         * Max rows (default 100, max 500)
         */
        limit?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<ListEventsByGroupOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/events',
            path: {
                'group_id': groupId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                400: `Invalid group_id / limit / offset`,
                502: `Upstream events worker unavailable`,
            },
        });
    }
    /**
     * Get a group with its members
     * Returns the FULL group fields PLUS an enriched
     * member list (user_id + username + display_name +
     * avatar_url + role). Anonymous-OK for public groups.
     * Member rows ordered by joined_at ASC. Go emits
     * the PublicUser-equivalent narrow projection.
     * @returns GroupWithMembersOut OK
     * @throws ApiError
     */
    public static getGroupMembers({
        groupId,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
    }): CancelablePromise<GroupWithMembersOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/members',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group_id`,
                404: `Group not found (or private + caller not allowed)`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a member to a group
     * Add a user to a group with a specified role. Requires
     * admin/owner/manager role in the group OR platform-admin
     * flag on the actor. Path's group_id wins over any
     * group_id in the request body.
     * @returns GroupMembershipOut OK
     * @throws ApiError
     */
    public static addGroupMember({
        groupId,
        requestBody,
    }: {
        /**
         * Group ID (bare UUID or 'grp_<uuid>')
         */
        groupId: any,
        /**
         * Membership payload
         */
        requestBody: GroupMembershipIn,
    }): CancelablePromise<GroupMembershipOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/groups/{group_id}/members',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or already a member`,
                401: `Authentication required`,
                403: `Caller lacks group-admin authority`,
                404: `Group or target user not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove a member from a group
     * Remove a user from a group. Caller may remove themselves
     * (self-leave path) OR remove another user as group admin
     * / owner / manager / platform-admin (kick path). 204 on
     * success.
     * @returns void
     * @throws ApiError
     */
    public static removeGroupMember({
        groupId,
        userId,
    }: {
        /**
         * Group ID (bare UUID or 'grp_<uuid>')
         */
        groupId: any,
        /**
         * User ID (bare UUID or 'usr_<uuid>')
         */
        userId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/groups/{group_id}/members/{user_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
            },
            errors: {
                400: `Invalid group_id or user_id`,
                401: `Authentication required`,
                403: `Caller is neither the target nor an admin`,
                404: `Membership not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List the roles a member holds in this group
     * Returns the roles the supplied (group_id, user_id)
     * pair currently holds in the group, ordered by
     * position then name.
     * Empty slice → wire `[]`.
     * @returns GroupRoleOut OK
     * @throws ApiError
     */
    public static listMemberRoles({
        groupId,
        userId,
    }: {
        /**
         * Group ID (bare UUID or 'grp_<uuid>')
         */
        groupId: any,
        /**
         * User ID (bare UUID or 'usr_<uuid>')
         */
        userId: any,
    }): CancelablePromise<Array<GroupRoleOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/members/{user_id}/roles',
            path: {
                'group_id': groupId,
                'user_id': userId,
            },
            errors: {
                400: `Invalid group_id or user_id`,
                500: `Internal error`,
            },
        });
    }
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
     * List group memberships
     * Return all memberships of a group with roles and join
     * dates.
     * @returns GroupMembershipOut OK
     * @throws ApiError
     */
    public static listGroupMemberships({
        groupId,
    }: {
        /**
         * Group ID (bare UUID or 'grp_<uuid>')
         */
        groupId: any,
    }): CancelablePromise<Array<GroupMembershipOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/memberships',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group_id`,
                404: `Group not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Set notification channels for a group
     * Upserts the group's
     * entity_notification_settings row via the
     * notifications-worker cross-worker contract.
     * Requires group-admin authority (owner / admin /
     * manager / platform-admin).
     * @returns groupNotificationSettingsOut OK
     * @throws ApiError
     */
    public static setGroupNotificationSettings({
        groupId,
        allowedChannels,
        discordWebhookUrl,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
        /**
         * email|discord|webhook
         */
        allowedChannels?: any,
        /**
         * Discord webhook URL
         */
        discordWebhookUrl?: any,
    }): CancelablePromise<groupNotificationSettingsOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/groups/{group_id}/notification-settings',
            path: {
                'group_id': groupId,
            },
            query: {
                'allowed_channels': allowedChannels,
                'discord_webhook_url': discordWebhookUrl,
            },
            errors: {
                400: `Invalid group_id / query`,
                401: `Authentication required`,
                404: `Group not found or caller lacks admin authority`,
                502: `Upstream notifications worker unavailable`,
            },
        });
    }
    /**
     * Get a group's editable profile fields
     * Returns the raw `Group` row by id - name,
     * description, bio_md, website_url, location,
     * legacy avatar_url/banner_url, background media,
     * visibility, platform tag, vrchat link, and types.
     * Anonymous; same wire shape as GET /groups/{id}.
     * @returns GroupOut OK
     * @throws ApiError
     */
    public static getGroupProfile({
        groupId,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
    }): CancelablePromise<GroupOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/profile',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Bad group_id format`,
                404: `Group not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a group's public profile fields
     * Update bio_md / website_url / location / avatar_url /
     * banner_url / is_public. Caller must be a group
     * admin/owner/manager or platform admin.
     * @returns GroupOut OK
     * @throws ApiError
     */
    public static updateGroupProfile({
        groupId,
        requestBody,
    }: {
        /**
         * Group ID
         */
        groupId: any,
        /**
         * Profile patch payload
         */
        requestBody: GroupProfileUpdateIn,
    }): CancelablePromise<GroupOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/groups/{group_id}/profile',
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
            },
        });
    }
    /**
     * Get group profile background media
     * Returns the configured background. Public groups
     * are visible to anonymous callers; private groups
     * require a member or platform admin.
     * @returns groupMediaBackgroundOut OK
     * @throws ApiError
     */
    public static getGroupProfileBackground({
        groupId,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
    }): CancelablePromise<groupMediaBackgroundOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/profile/background',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group_id`,
                404: `Group not found or background not set`,
                502: `media-ingest upstream unavailable`,
            },
        });
    }
    /**
     * Assign group profile background media
     * Assign an image/video upload as group profile
     * background. Video backgrounds must be <= 10MB.
     * Requires groups-editor (admin/owner/manager) on
     * the target group; upload must be owned by caller
     * or by the group.
     * @returns groupMediaBackgroundOut OK
     * @throws ApiError
     */
    public static assignGroupProfileBackground({
        groupId,
        requestBody,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
        /**
         * Background assignment
         */
        requestBody: groupMediaBackgroundIn,
    }): CancelablePromise<groupMediaBackgroundOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/groups/{group_id}/profile/background',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / IDs`,
                401: `Authentication required`,
                403: `Upload ownership does not match this group`,
                404: `Group or upload not found`,
                422: `Background media must be image/video; videos <= 10MB`,
                502: `media-ingest upstream unavailable`,
            },
        });
    }
    /**
     * List a group's roles
     * Returns both VRChat-mirrored roles and app-only
     * roles, ordered by position then name.
     * py:1615`) has no auth dependency. 404 if the group
     * is absent.
     * @returns GroupRoleOut OK
     * @throws ApiError
     */
    public static listGroupRoles({
        groupId,
    }: {
        /**
         * Group ID (bare UUID or 'grp_<uuid>')
         */
        groupId: any,
    }): CancelablePromise<Array<GroupRoleOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/roles',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group_id`,
                404: `Group not found`,
                500: `Internal error`,
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
    /**
     * List the types a group belongs to
     * Returns the group-type tags assigned to this group.
     * A group can hold multiple types (e.g. Label +
     * Event Crew). Anonymous read.
     * @returns GroupTypeOut OK
     * @throws ApiError
     */
    public static getGroupTypes({
        groupId,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
    }): CancelablePromise<Array<GroupTypeOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/types',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Bad group_id format`,
                404: `Group not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Replace the set of types a group belongs to
     * Replace semantics: the supplied list becomes the
     * group's full type set. Send an empty list to
     * clear all types. Requires platform-admin OR
     * admin/owner/manager role in the group.
     * @returns GroupTypeOut OK
     * @throws ApiError
     */
    public static replaceGroupTypes({
        groupId,
        requestBody,
    }: {
        /**
         * Group ID (bare UUID or 'grp_<uuid>')
         */
        groupId: any,
        /**
         * Type ids to set (replace semantics)
         */
        requestBody: GroupTypesReplaceIn,
    }): CancelablePromise<Array<GroupTypeOut>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/groups/{group_id}/types',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or group_id`,
                401: `Authentication required`,
                403: `Caller lacks group-admin authority`,
                404: `Group not found`,
                422: `Unknown group_type ids`,
                500: `Internal error`,
                501: `Write path unwired on this deployment`,
            },
        });
    }
    /**
     * List media uploads owned by a group
     * Returns media uploads associated with the group.
     * @returns groupUploadListItem OK
     * @throws ApiError
     */
    public static listGroupUploads({
        groupId,
        skip,
        limit,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
        /**
         * Pagination offset
         */
        skip?: any,
        /**
         * Page size (default 50, max 200)
         */
        limit?: any,
    }): CancelablePromise<Array<groupUploadListItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/uploads',
            path: {
                'group_id': groupId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                400: `Invalid group_id`,
                401: `Authentication required`,
                404: `Group not found`,
                502: `media-ingest upstream unavailable`,
            },
        });
    }
    /**
     * Reassign an existing upload to this group
     * Move a media upload into the group. Caller must be
     * a groups-editor (admin/owner/manager) AND must own
     * the upload (or be platform admin).
     * @returns groupUploadAssignmentOut OK
     * @throws ApiError
     */
    public static assignUploadToGroup({
        groupId,
        uploadId,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
        /**
         * Upload UUID or upl_<uuid>
         */
        uploadId: any,
    }): CancelablePromise<groupUploadAssignmentOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/groups/{group_id}/uploads/{upload_id}',
            path: {
                'group_id': groupId,
                'upload_id': uploadId,
            },
            errors: {
                400: `Invalid ids`,
                401: `Authentication required`,
                403: `Caller does not own upload or is not groups-editor`,
                404: `Group or upload not found`,
                502: `media-ingest upstream unavailable`,
            },
        });
    }
    /**
     * Unlink this group from VRChat
     * Clears `groups.vrchat_group_id`. Mirrored roles are
     * kept in place but stop being refreshed. Idempotent.
     * @returns void
     * @throws ApiError
     */
    public static unlinkGroupFromVrchat({
        groupId,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/groups/{group_id}/vrchat-link',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group_id`,
                401: `Authentication required`,
                403: `Group admin required`,
                404: `Group not found`,
            },
        });
    }
    /**
     * Link this group to a VRChat group (1:1)
     * Writes `groups.vrchat_group_id`. 409 when another
     * Rave.Page group already owns this VRChat link.
     * When `sync_roles=true` (default), the response
     * carries `role_sync: null` in the Go port - the
     * vrchat-worker role-sync contract is pending.
     * @returns VRChatGroupLinkOut OK
     * @throws ApiError
     */
    public static linkGroupToVrchat({
        groupId,
        requestBody,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
        /**
         * Link payload
         */
        requestBody: VRChatGroupLinkIn,
    }): CancelablePromise<VRChatGroupLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/groups/{group_id}/vrchat-link',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or group_id`,
                401: `Authentication required`,
                403: `Group admin required`,
                404: `Group not found`,
                409: `Already linked to another group`,
                422: `vrchat_group_id required`,
            },
        });
    }
    /**
     * List a user's group memberships
     * Public read of the groups a user belongs to or runs, for the
     * profile-page "groups/communities" section. Anonymous and
     * third-party callers see only public groups (is_public=true);
     * the subject user and platform admins also see the user's
     * private groups. Each row carries the SUBJECT user's
     * membership_role and can_organize_events (the FE splits
     * "runs" vs "belongs to" on can_organize_events); the viewer
     * overlay (can_edit / my_role / relationship) is stamped only
     * on the self-view, matching GET /groups/mine. An unknown
     * user_id returns an empty array, NOT 404, so the endpoint
     * never discloses whether a user id exists.
     * @returns GroupWithMembershipRoleOut OK
     * @throws ApiError
     */
    public static listUserGroups({
        userId,
    }: {
        /**
         * User ID (UUID or usr_<uuid>)
         */
        userId: any,
    }): CancelablePromise<Array<GroupWithMembershipRoleOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}/groups',
            path: {
                'user_id': userId,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
