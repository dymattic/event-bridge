/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BotAccountCreateIn } from '../models/BotAccountCreateIn';
import type { BotAccountDetailOut } from '../models/BotAccountDetailOut';
import type { BotAccountLoginOut } from '../models/BotAccountLoginOut';
import type { BotAccountOut } from '../models/BotAccountOut';
import type { BotAccountUpdateIn } from '../models/BotAccountUpdateIn';
import type { BotEmailOtpVerifyIn } from '../models/BotEmailOtpVerifyIn';
import type { BotGroupAssignmentCreateIn } from '../models/BotGroupAssignmentCreateIn';
import type { BotGroupAssignmentOut } from '../models/BotGroupAssignmentOut';
import type { BotTotpSetupIn } from '../models/BotTotpSetupIn';
import type { ClubVerificationInitiateIn } from '../models/ClubVerificationInitiateIn';
import type { ClubVerificationOut } from '../models/ClubVerificationOut';
import type { GroupFavouriteCreateIn } from '../models/GroupFavouriteCreateIn';
import type { GroupFavouriteOut } from '../models/GroupFavouriteOut';
import type { GroupFavouriteReorderIn } from '../models/GroupFavouriteReorderIn';
import type { GroupFavouriteUpdateIn } from '../models/GroupFavouriteUpdateIn';
import type { GroupRoleSyncReportOut } from '../models/GroupRoleSyncReportOut';
import type { InstancePresenceOut } from '../models/InstancePresenceOut';
import type { InstancePresenceReportIn } from '../models/InstancePresenceReportIn';
import type { OperationResultOut } from '../models/OperationResultOut';
import type { PresenceConsentOut } from '../models/PresenceConsentOut';
import type { PresenceConsentUpdateIn } from '../models/PresenceConsentUpdateIn';
import type { ProfileLimits } from '../models/ProfileLimits';
import type { RepresentedGroupOut } from '../models/RepresentedGroupOut';
import type { RepresentedGroupSetIn } from '../models/RepresentedGroupSetIn';
import type { VRChatCreateGroupRoleIn } from '../models/VRChatCreateGroupRoleIn';
import type { VRChatCreateInstanceIn } from '../models/VRChatCreateInstanceIn';
import type { VRChatFileOut } from '../models/VRChatFileOut';
import type { VRChatFriendActionOut } from '../models/VRChatFriendActionOut';
import type { VRChatFriendDiscoveryOut } from '../models/VRChatFriendDiscoveryOut';
import type { VRChatFriendOut } from '../models/VRChatFriendOut';
import type { VRChatGroupAnnouncementIn } from '../models/VRChatGroupAnnouncementIn';
import type { VRChatGroupAnnouncementOut } from '../models/VRChatGroupAnnouncementOut';
import type { VRChatGroupAuditLogOut } from '../models/VRChatGroupAuditLogOut';
import type { VRChatGroupBanIn } from '../models/VRChatGroupBanIn';
import type { VRChatGroupBanOut } from '../models/VRChatGroupBanOut';
import type { VRChatGroupGalleryImageAddIn } from '../models/VRChatGroupGalleryImageAddIn';
import type { VRChatGroupGalleryImageOut } from '../models/VRChatGroupGalleryImageOut';
import type { VRChatGroupInviteIn } from '../models/VRChatGroupInviteIn';
import type { VRChatGroupInviteOut } from '../models/VRChatGroupInviteOut';
import type { VRChatGroupJoinRequestActionIn } from '../models/VRChatGroupJoinRequestActionIn';
import type { VRChatGroupJoinRequestOut } from '../models/VRChatGroupJoinRequestOut';
import type { VRChatGroupLinkIn } from '../models/VRChatGroupLinkIn';
import type { VRChatGroupLinkOut } from '../models/VRChatGroupLinkOut';
import type { VRChatGroupMemberOut } from '../models/VRChatGroupMemberOut';
import type { VRChatGroupOut } from '../models/VRChatGroupOut';
import type { VRChatGroupPermissionsOut } from '../models/VRChatGroupPermissionsOut';
import type { VRChatGroupPostOut } from '../models/VRChatGroupPostOut';
import type { VRChatGroupRoleOut } from '../models/VRChatGroupRoleOut';
import type { VRChatGroupVerificationOut } from '../models/VRChatGroupVerificationOut';
import type { VRChatInstanceOut } from '../models/VRChatInstanceOut';
import type { VRChatInviteActionOut } from '../models/VRChatInviteActionOut';
import type { VRChatNotificationOut } from '../models/VRChatNotificationOut';
import type { VRChatProfileUpdateIn } from '../models/VRChatProfileUpdateIn';
import type { VRChatSendInviteIn } from '../models/VRChatSendInviteIn';
import type { VRChatUpdateGroupRoleIn } from '../models/VRChatUpdateGroupRoleIn';
import type { VRChatUserOut } from '../models/VRChatUserOut';
import type { VRChatUserVerificationOut } from '../models/VRChatUserVerificationOut';
import type { VRChatWorldOut } from '../models/VRChatWorldOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VrchatService {
    /**
     * List VRChat bot accounts (admin)
     * Returns all VRChat bot accounts. Admin-only - non-
     * admins receive 403. `active_only=true` filters to
     * is_active=true. No credential columns surface.
     * @returns BotAccountOut OK
     * @throws ApiError
     */
    public static listBotAccounts({
        activeOnly,
    }: {
        /**
         * Filter to active bots only
         */
        activeOnly?: any,
    }): CancelablePromise<Array<BotAccountOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/vrchat-bots',
            query: {
                'active_only': activeOnly,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                500: `Could not list bot accounts`,
            },
        });
    }
    /**
     * Create a VRChat bot account (admin)
     * Inserts a new bot account; credentials are encrypted
     * at rest. Admin-only.
     * @returns BotAccountOut Created
     * @throws ApiError
     */
    public static createBotAccount({
        requestBody,
    }: {
        /**
         * Bot create payload
         */
        requestBody: BotAccountCreateIn,
    }): CancelablePromise<BotAccountOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vrchat-bots',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Admin access required`,
                409: `Bot account label already exists`,
                422: `Validation failed`,
                500: `Could not create bot account`,
                503: `Encryption not configured`,
            },
        });
    }
    /**
     * Assign a bot to a VRChat group (admin)
     * Links a bot account to a VRChat group it will manage.
     * Admin-only. Pre-checks bot existence, max_groups,
     * duplicate (bot, vrchat_group_id) pair.
     * @returns BotGroupAssignmentOut Created
     * @throws ApiError
     */
    public static createBotGroupAssignment({
        requestBody,
    }: {
        /**
         * Assignment payload
         */
        requestBody: BotGroupAssignmentCreateIn,
    }): CancelablePromise<BotGroupAssignmentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vrchat-bots/assignments',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Bot account not found`,
                409: `Bot is already assigned to this VRChat group`,
                422: `Validation failed`,
                500: `Could not create assignment`,
            },
        });
    }
    /**
     * Remove a bot group assignment (admin)
     * Deletes one assignment row by id. Admin-only.
     * @returns void
     * @throws ApiError
     */
    public static deleteBotGroupAssignment({
        assignmentId,
    }: {
        /**
         * Assignment id (UUID)
         */
        assignmentId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/vrchat-bots/assignments/{assignment_id}',
            path: {
                'assignment_id': assignmentId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Assignment not found`,
                422: `assignment_id malformed`,
                500: `Could not delete assignment`,
            },
        });
    }
    /**
     * Delete a VRChat bot account (admin)
     * Removes the bot account; CASCADE drops its group
     * assignments. Admin-only. 204 on success, 404 when
     * not found.
     * @returns void
     * @throws ApiError
     */
    public static deleteBotAccount({
        botId,
    }: {
        /**
         * Bot id (UUID or vrcb_<uuid>)
         */
        botId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/vrchat-bots/{bot_id}',
            path: {
                'bot_id': botId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Bot account not found`,
                422: `bot_id malformed`,
                500: `Could not delete bot account`,
            },
        });
    }
    /**
     * Get VRChat bot account detail (admin)
     * Returns one bot row + its group assignments. Admin-
     * only. 404 when not found. No credential columns
     * surface.
     * @returns BotAccountDetailOut OK
     * @throws ApiError
     */
    public static getBotAccount({
        botId,
    }: {
        /**
         * Bot id (UUID or vrcb_<uuid>)
         */
        botId: any,
    }): CancelablePromise<BotAccountDetailOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/vrchat-bots/{bot_id}',
            path: {
                'bot_id': botId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Bot account not found`,
                422: `bot_id malformed`,
                500: `Could not load bot account`,
            },
        });
    }
    /**
     * Update a VRChat bot account (admin)
     * Partial update; credentials are re-encrypted when
     * supplied + cached cookies cleared. Admin-only.
     * @returns BotAccountOut OK
     * @throws ApiError
     */
    public static updateBotAccount({
        botId,
        requestBody,
    }: {
        /**
         * Bot id (UUID or vrcb_<uuid>)
         */
        botId: any,
        /**
         * Patch fields
         */
        requestBody: BotAccountUpdateIn,
    }): CancelablePromise<BotAccountOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/vrchat-bots/{bot_id}',
            path: {
                'bot_id': botId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Bot account not found`,
                409: `Bot account label already exists`,
                422: `Validation failed`,
                500: `Could not update bot account`,
                503: `Encryption not configured`,
            },
        });
    }
    /**
     * List VRChat bot group assignments (admin)
     * Returns the bot's group assignments, ordered by
     * created_at ASC. Admin-only. 404 when the bot doesn't
     * exist.
     * @returns BotGroupAssignmentOut OK
     * @throws ApiError
     */
    public static listBotAssignments({
        botId,
    }: {
        /**
         * Bot id (UUID or vrcb_<uuid>)
         */
        botId: any,
    }): CancelablePromise<Array<BotGroupAssignmentOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/vrchat-bots/{bot_id}/assignments',
            path: {
                'bot_id': botId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Bot account not found`,
                422: `bot_id malformed`,
                500: `Could not list assignments`,
            },
        });
    }
    /**
     * Test login for a bot account (admin)
     * Decrypts stored creds, authenticates with VRChat
     * (auto-TOTP when configured), caches the resulting
     * session cookies.
     * @returns BotAccountLoginOut OK
     * @throws ApiError
     */
    public static loginBotAccount({
        botId,
    }: {
        /**
         * Bot id (UUID or vrcb_<uuid>)
         */
        botId: any,
    }): CancelablePromise<BotAccountLoginOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vrchat-bots/{bot_id}/login',
            path: {
                'bot_id': botId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Bot account not found`,
                422: `Bot disabled or bot_id malformed`,
                502: `Upstream VRChat error`,
                503: `Legacy credentials or encryption unavailable`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Set up TOTP 2FA for a bot account (admin)
     * Stores a TOTP setup key from VRChat for automatic
     * 2FA login. Spaces / dashes / case normalized.
     * @returns BotAccountOut OK
     * @throws ApiError
     */
    public static setupBotTotp({
        botId,
        requestBody,
    }: {
        /**
         * Bot id (UUID or vrcb_<uuid>)
         */
        botId: any,
        /**
         * TOTP secret payload
         */
        requestBody: BotTotpSetupIn,
    }): CancelablePromise<BotAccountOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vrchat-bots/{bot_id}/setup-totp',
            path: {
                'bot_id': botId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Bot account not found`,
                422: `Invalid TOTP secret`,
                503: `Encryption unavailable`,
            },
        });
    }
    /**
     * Submit email verification code for bot account setup (admin)
     * Continuation of /login when VRChat asked for an
     * email OTP.
     * @returns BotAccountLoginOut OK
     * @throws ApiError
     */
    public static verifyBotEmailOtp({
        botId,
        requestBody,
    }: {
        /**
         * Bot id (UUID or vrcb_<uuid>)
         */
        botId: any,
        /**
         * OTP payload
         */
        requestBody: BotEmailOtpVerifyIn,
    }): CancelablePromise<BotAccountLoginOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vrchat-bots/{bot_id}/verify-email-otp',
            path: {
                'bot_id': botId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Bot account not found`,
                422: `No pending login session or malformed bot_id/code`,
                502: `Upstream VRChat error`,
                503: `Legacy credentials or encryption unavailable`,
                504: `VRChat upstream timed out`,
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
     * Revoke club VRChat verification (admin)
     * Admin-only delete of one club's verification record.
     * Returns 204 on success, 404 when no record exists.
     * Non-admin callers receive 403 "Admin access required".
     * @returns void
     * @throws ApiError
     */
    public static revokeClubVerification({
        clubId,
    }: {
        /**
         * Club id (UUID or club_<uuid>)
         */
        clubId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vrchat/clubs/{club_id}/verification',
            path: {
                'club_id': clubId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No verification record for this club`,
                422: `club_id malformed`,
                500: `Could not revoke verification`,
            },
        });
    }
    /**
     * Get club VRChat verification status
     * Anonymous read of one club's VRChat verification record.
     * Returns the current verification state (pending /
     * verified / failed / revoked) plus VRChat-side metadata
     * snapshot at verify time.
     * @returns ClubVerificationOut OK
     * @throws ApiError
     */
    public static getClubVerification({
        clubId,
    }: {
        /**
         * Club id (UUID or club_<uuid>)
         */
        clubId: any,
    }): CancelablePromise<ClubVerificationOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/clubs/{club_id}/verification',
            path: {
                'club_id': clubId,
            },
            errors: {
                404: `No verification record for this club`,
                422: `club_id malformed`,
                500: `Could not load verification`,
            },
        });
    }
    /**
     * Initiate VRChat group verification for a club (admin)
     * Starts the verification process to link a club to a
     * VRChat group. For `bot_membership_check`,
     * uses the bot assigned to the VRChat group (if any) to
     * fetch group metadata and mark verified; for
     * `user_ownership_proof`, the verification is recorded as
     * `failed` until identity's OAuth-access-token contract
     * supports vrchat.
     * @returns ClubVerificationOut Created
     * @throws ApiError
     */
    public static initiateClubVerification({
        clubId,
        requestBody,
    }: {
        /**
         * Club id (UUID or club_<uuid>)
         */
        clubId: any,
        /**
         * Verify payload
         */
        requestBody: ClubVerificationInitiateIn,
    }): CancelablePromise<ClubVerificationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/clubs/{club_id}/verify',
            path: {
                'club_id': clubId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Insufficient permissions to verify this club`,
                409: `Club already has a verification record. Revoke it first to re-verify.`,
                422: `Validation failed (method / id)`,
                500: `Could not initiate verification`,
            },
        });
    }
    /**
     * List VRChat files
     * Lists the bot's VRChat files. md.
     * @returns VRChatFileOut OK
     * @throws ApiError
     */
    public static listVrchatFiles({
        tag,
        n,
        offset,
    }: {
        /**
         * Filter by tag (icon, gallery, ...)
         */
        tag?: any,
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatFileOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/files',
            query: {
                'tag': tag,
                'n': n,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                503: `Legacy credentials`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Delete VRChat file
     * Deletes a file owned by the bot account.
     * @returns OperationResultOut OK
     * @throws ApiError
     */
    public static deleteVrchatFile({
        fileId,
    }: {
        /**
         * VRChat file id
         */
        fileId: any,
    }): CancelablePromise<OperationResultOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vrchat/files/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `File not found`,
                422: `file_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Get VRChat file details
     * Returns the upstream VRChat file shape including
     * version history.
     * @returns VRChatFileOut OK
     * @throws ApiError
     */
    public static getVrchatFile({
        fileId,
    }: {
        /**
         * VRChat file id
         */
        fileId: any,
    }): CancelablePromise<VRChatFileOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/files/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `File not found`,
                422: `file_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List VRChat friends
     * Friends of the authenticated bot, optionally
     * filtered by offline state.
     * @returns VRChatFriendOut OK
     * @throws ApiError
     */
    public static listVrchatFriends({
        limit,
        offset,
        offline,
    }: {
        /**
         * Max results (default 100)
         */
        limit?: any,
        /**
         * Pagination offset
         */
        offset?: any,
        /**
         * When set, filters by offline state
         */
        offline?: any,
    }): CancelablePromise<Array<VRChatFriendOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/friends',
            query: {
                'limit': limit,
                'offset': offset,
                'offline': offline,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Discover VRChat friends on Rave.Page
     * Returns Rave.Page users that overlap with the caller's
     * VRChat friends list.
     * @returns VRChatFriendDiscoveryOut OK
     * @throws ApiError
     */
    public static discoverVrchatFriends(): CancelablePromise<VRChatFriendDiscoveryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/friends/discover',
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Unfriend VRChat user
     * Remove a user from the bot's VRChat friends.
     * @returns VRChatFriendActionOut OK
     * @throws ApiError
     */
    public static removeVrchatFriend({
        userId,
    }: {
        /**
         * VRChat user id
         */
        userId: any,
    }): CancelablePromise<VRChatFriendActionOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vrchat/friends/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `user_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Send VRChat friend request
     * Send a friend request via the bot session.
     * @returns VRChatFriendActionOut OK
     * @throws ApiError
     */
    public static addVrchatFriend({
        userId,
    }: {
        /**
         * VRChat user id
         */
        userId: any,
    }): CancelablePromise<VRChatFriendActionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/friends/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `user_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List the bot's VRChat groups
     * Returns the groups the authenticated bot session is a
     * member of.
     * @returns VRChatGroupOut OK
     * @throws ApiError
     */
    public static listVrchatGroups(): CancelablePromise<Array<VRChatGroupOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups',
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                503: `Legacy credentials`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List favourite VRChat groups
     * Returns all VRChat groups the current user has
     * favourited on Rave.Page, optionally filtered by
     * collection. Ordered by collection ASC (NULLS last),
     * sort_order ASC, created_at ASC. Cached VRChat
     * metadata is included so the FE does not call VRChat.
     * @returns GroupFavouriteOut OK
     * @throws ApiError
     */
    public static listVrchatGroupFavourites({
        collection,
    }: {
        /**
         * Filter by collection name
         */
        collection?: any,
    }): CancelablePromise<Array<GroupFavouriteOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/favourites',
            query: {
                'collection': collection,
            },
            errors: {
                401: `Authentication required`,
                500: `Could not list favourites`,
            },
        });
    }
    /**
     * List favourite collections
     * Returns the sorted, distinct, non-null `collection`
     * labels for the authenticated user's favourite-VRChat-
     * group rows. Powers the FE's collection-picker UI;
     * the cached row metadata means the FE does not need to
     * call VRChat to render the collections list.
     * @returns string OK
     * @throws ApiError
     */
    public static listVrchatGroupFavouriteCollections(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/favourites/collections',
            errors: {
                401: `Authentication required`,
                500: `Could not list favourite collections`,
            },
        });
    }
    /**
     * Reorder favourite groups
     * Batch-update sort positions for multiple favourited
     * groups. Items belonging to another user are silently
     * skipped (the WHERE user_id filter excludes them).
     * Returns the full post-commit favourites list.
     * @returns GroupFavouriteOut OK
     * @throws ApiError
     */
    public static reorderVrchatGroupFavourites({
        requestBody,
    }: {
        /**
         * Reorder items
         */
        requestBody: GroupFavouriteReorderIn,
    }): CancelablePromise<Array<GroupFavouriteOut>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vrchat/groups/favourites/reorder',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required`,
                422: `Validation failed (item id format)`,
                501: `Favourite writes not configured`,
            },
        });
    }
    /**
     * Remove a favourite group
     * Remove a VRChat group from the current user's
     * favourites.
     * @returns void
     * @throws ApiError
     */
    public static removeVrchatGroupFavourite({
        favouriteId,
    }: {
        /**
         * Favourite id (UUID or vfav_<uuid>)
         */
        favouriteId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vrchat/groups/favourites/{favourite_id}',
            path: {
                'favourite_id': favouriteId,
            },
            errors: {
                400: `Invalid favourite_id`,
                401: `Authentication required`,
                404: `Favourite not found`,
                422: `favourite_id wrong prefix`,
                501: `Favourite writes not configured`,
            },
        });
    }
    /**
     * Update a favourite group
     * Update collection, note, or sort_order of a favourited
     * group. Partial: absent fields leave the column
     * untouched; an empty-string collection or note clears
     * the column to NULL. Returns the post-update row.
     * @returns GroupFavouriteOut OK
     * @throws ApiError
     */
    public static updateVrchatGroupFavourite({
        favouriteId,
        requestBody,
    }: {
        /**
         * Favourite id (UUID or vfav_<uuid>)
         */
        favouriteId: any,
        /**
         * Patch fields
         */
        requestBody: GroupFavouriteUpdateIn,
    }): CancelablePromise<GroupFavouriteOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/vrchat/groups/favourites/{favourite_id}',
            path: {
                'favourite_id': favouriteId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid favourite_id or body`,
                401: `Authentication required`,
                404: `Favourite not found`,
                422: `Validation failed (length / prefix)`,
                501: `Favourite writes not configured`,
            },
        });
    }
    /**
     * Get VRChat group details
     * Returns the upstream VRChat group shape.
     * @returns VRChatGroupOut OK
     * @throws ApiError
     */
    public static getVrchatGroup({
        groupId,
    }: {
        /**
         * VRChat group id (grp_...)
         */
        groupId: any,
    }): CancelablePromise<VRChatGroupOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}',
            path: {
                'group_id': groupId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Group not found`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Create VRChat group announcement
     * Create an announcement in a VRChat group.
     * @returns VRChatGroupAnnouncementOut OK
     * @throws ApiError
     */
    public static createVrchatGroupAnnouncement({
        groupId,
        requestBody,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Announcement payload
         */
        requestBody: VRChatGroupAnnouncementIn,
    }): CancelablePromise<VRChatGroupAnnouncementOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/groups/{group_id}/announcements',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id / title / text required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List VRChat group audit logs
     * Returns moderation audit log entries. Requires group
     * moderation rights on the bot.
     * @returns VRChatGroupAuditLogOut OK
     * @throws ApiError
     */
    public static listVrchatGroupAuditLogs({
        groupId,
        n,
        offset,
        startDate,
        endDate,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
        /**
         * ISO 8601 start date
         */
        startDate?: any,
        /**
         * ISO 8601 end date
         */
        endDate?: any,
    }): CancelablePromise<Array<VRChatGroupAuditLogOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/audit-logs',
            path: {
                'group_id': groupId,
            },
            query: {
                'n': n,
                'offset': offset,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Group not found`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List VRChat group bans
     * Returns banned users for a group.
     * @returns VRChatGroupBanOut OK
     * @throws ApiError
     */
    public static listVrchatGroupBans({
        groupId,
        n,
        offset,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatGroupBanOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/bans',
            path: {
                'group_id': groupId,
            },
            query: {
                'n': n,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Group not found`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Ban user from VRChat group
     * Ban a user from a VRChat group via the bot session.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static banVrchatGroupMember({
        groupId,
        requestBody,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Ban payload
         */
        requestBody: VRChatGroupBanIn,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/groups/{group_id}/bans',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id or userId required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Unban user from VRChat group
     * Remove a ban for a user.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static unbanVrchatGroupMember({
        groupId,
        userId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * VRChat user id
         */
        userId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vrchat/groups/{group_id}/bans/{user_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id or user_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Favourite a VRChat group
     * Add a VRChat group to the current user's favourites.
     * Best-effort fetches group metadata from VRChat at
     * insert-time so the FE can render without calling
     * VRChat. Returns 409 when the user has already
     * favourited this group.
     * @returns GroupFavouriteOut Created
     * @throws ApiError
     */
    public static addVrchatGroupFavourite({
        groupId,
        requestBody,
    }: {
        /**
         * VRChat group id (grp_...)
         */
        groupId: any,
        /**
         * Favourite payload
         */
        requestBody: GroupFavouriteCreateIn,
    }): CancelablePromise<GroupFavouriteOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/groups/{group_id}/favourite',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                409: `Group already favourited`,
                422: `Validation failed (length / required)`,
                501: `Favourite writes not configured`,
            },
        });
    }
    /**
     * List VRChat group gallery images
     * Returns images in a group gallery.
     * @returns VRChatGroupGalleryImageOut OK
     * @throws ApiError
     */
    public static listVrchatGroupGalleryImages({
        groupId,
        galleryId,
        n,
        offset,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Gallery id (ggal_...)
         */
        galleryId: any,
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatGroupGalleryImageOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/galleries/{gallery_id}/images',
            path: {
                'group_id': groupId,
                'gallery_id': galleryId,
            },
            query: {
                'n': n,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Gallery not found`,
                422: `group_id or gallery_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Add image to VRChat group gallery
     * Add an image to a group gallery by file id.
     * @returns VRChatGroupGalleryImageOut OK
     * @throws ApiError
     */
    public static addVrchatGroupGalleryImage({
        groupId,
        galleryId,
        requestBody,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Gallery id
         */
        galleryId: any,
        /**
         * Image payload
         */
        requestBody: VRChatGroupGalleryImageAddIn,
    }): CancelablePromise<VRChatGroupGalleryImageOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/groups/{group_id}/galleries/{gallery_id}/images',
            path: {
                'group_id': groupId,
                'gallery_id': galleryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id / gallery_id / fileId required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Delete VRChat group gallery image
     * Delete an image from a group gallery.
     * @returns OperationResultOut OK
     * @throws ApiError
     */
    public static deleteVrchatGroupGalleryImage({
        groupId,
        galleryId,
        imageId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Gallery id
         */
        galleryId: any,
        /**
         * Image id
         */
        imageId: any,
    }): CancelablePromise<OperationResultOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vrchat/groups/{group_id}/galleries/{gallery_id}/images/{image_id}',
            path: {
                'group_id': groupId,
                'gallery_id': galleryId,
                'image_id': imageId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List active instances for a VRChat group
     * Returns currently active instances owned by the
     * group.
     * @returns VRChatInstanceOut OK
     * @throws ApiError
     */
    public static getVrchatGroupInstances({
        groupId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
    }): CancelablePromise<Array<VRChatInstanceOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/instances',
            path: {
                'group_id': groupId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Group not found`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List pending VRChat group invites
     * Returns invites the group has sent.
     * @returns VRChatGroupInviteOut OK
     * @throws ApiError
     */
    public static listVrchatGroupInvites({
        groupId,
        n,
        offset,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatGroupInviteOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/invites',
            path: {
                'group_id': groupId,
            },
            query: {
                'n': n,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Group not found`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Invite user to VRChat group
     * Invite a user to join a VRChat group.
     * @returns VRChatGroupInviteOut OK
     * @throws ApiError
     */
    public static inviteToVrchatGroup({
        groupId,
        requestBody,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Invite payload
         */
        requestBody: VRChatGroupInviteIn,
    }): CancelablePromise<VRChatGroupInviteOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/groups/{group_id}/invites',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id or userId required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Cancel VRChat group invite
     * Cancel a pending invite.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static cancelVrchatGroupInvite({
        groupId,
        userId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * VRChat user id
         */
        userId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vrchat/groups/{group_id}/invites/{user_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id or user_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List VRChat group members
     * Returns members with normalized profile fields.
     * @returns VRChatGroupMemberOut OK
     * @throws ApiError
     */
    public static getVrchatGroupMembers({
        groupId,
        limit,
        offset,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Max results (default 100)
         */
        limit?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatGroupMemberOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/members',
            path: {
                'group_id': groupId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Group not found`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Kick VRChat group member
     * Remove a member from a group.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static kickVrchatGroupMember({
        groupId,
        userId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * VRChat user id
         */
        userId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vrchat/groups/{group_id}/members/{user_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id or user_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Remove role from VRChat group member
     * Remove a role from a group member.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static removeRoleFromVrchatGroupMember({
        groupId,
        userId,
        roleId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * VRChat user id
         */
        userId: any,
        /**
         * Role id
         */
        roleId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vrchat/groups/{group_id}/members/{user_id}/roles/{role_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
                'role_id': roleId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id / user_id / role_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Add role to VRChat group member
     * Assign a role to a group member.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static addRoleToVrchatGroupMember({
        groupId,
        userId,
        roleId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * VRChat user id
         */
        userId: any,
        /**
         * Role id
         */
        roleId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vrchat/groups/{group_id}/members/{user_id}/roles/{role_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
                'role_id': roleId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id / user_id / role_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Get the bot's permissions in a VRChat group
     * Aggregates membership + role + permission view.
     * @returns VRChatGroupPermissionsOut OK
     * @throws ApiError
     */
    public static getVrchatGroupMyPermissions({
        groupId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
    }): CancelablePromise<VRChatGroupPermissionsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/my-permissions',
            path: {
                'group_id': groupId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Group not found`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List available permissions defined for a VRChat group
     * Returns permission descriptor objects.
     * @returns any OK
     * @throws ApiError
     */
    public static listVrchatGroupPermissions({
        groupId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
    }): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/permissions',
            path: {
                'group_id': groupId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Group not found`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List VRChat group posts/events
     * Returns the group's posts feed.
     * @returns VRChatGroupPostOut OK
     * @throws ApiError
     */
    public static listVrchatGroupPosts({
        groupId,
        n,
        offset,
        publicOnly,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
        /**
         * Return only public posts
         */
        publicOnly?: any,
    }): CancelablePromise<Array<VRChatGroupPostOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/posts',
            path: {
                'group_id': groupId,
            },
            query: {
                'n': n,
                'offset': offset,
                'public_only': publicOnly,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Group not found`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List pending VRChat group join requests
     * Returns users requesting to join.
     * @returns VRChatGroupJoinRequestOut OK
     * @throws ApiError
     */
    public static listVrchatGroupRequests({
        groupId,
        n,
        offset,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatGroupJoinRequestOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/requests',
            path: {
                'group_id': groupId,
            },
            query: {
                'n': n,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Group not found`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Respond to VRChat group join request
     * Accept or reject a pending join request.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static respondToVrchatGroupRequest({
        groupId,
        userId,
        requestBody,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * VRChat user id
         */
        userId: any,
        /**
         * Action payload
         */
        requestBody: VRChatGroupJoinRequestActionIn,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vrchat/groups/{group_id}/requests/{user_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `Invalid action`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List VRChat group roles
     * Get all roles defined for a VRChat group.
     * @returns VRChatGroupRoleOut OK
     * @throws ApiError
     */
    public static listVrchatGroupRoles({
        groupId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
    }): CancelablePromise<Array<VRChatGroupRoleOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/groups/{group_id}/roles',
            path: {
                'group_id': groupId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Create VRChat group role
     * Create a new role in a VRChat group.
     * @returns VRChatGroupRoleOut OK
     * @throws ApiError
     */
    public static createVrchatGroupRole({
        groupId,
        requestBody,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Role payload
         */
        requestBody: VRChatCreateGroupRoleIn,
    }): CancelablePromise<VRChatGroupRoleOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/groups/{group_id}/roles',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id or name required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Delete VRChat group role
     * Delete a role from a VRChat group.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static deleteVrchatGroupRole({
        groupId,
        roleId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Role id
         */
        roleId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vrchat/groups/{group_id}/roles/{role_id}',
            path: {
                'group_id': groupId,
                'role_id': roleId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id or role_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Update VRChat group role
     * Update an existing role in a VRChat group.
     * @returns VRChatGroupRoleOut OK
     * @throws ApiError
     */
    public static updateVrchatGroupRole({
        groupId,
        roleId,
        requestBody,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Role id
         */
        roleId: any,
        /**
         * Role payload
         */
        requestBody: VRChatUpdateGroupRoleIn,
    }): CancelablePromise<VRChatGroupRoleOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vrchat/groups/{group_id}/roles/{role_id}',
            path: {
                'group_id': groupId,
                'role_id': roleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id or role_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Create VRChat instance
     * Create a new instance of a VRChat world.
     * @returns VRChatInstanceOut OK
     * @throws ApiError
     */
    public static createVrchatInstance({
        requestBody,
    }: {
        /**
         * Instance create payload
         */
        requestBody: VRChatCreateInstanceIn,
    }): CancelablePromise<VRChatInstanceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/instances',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `worldId required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Get VRChat instance by short name
     * @returns VRChatInstanceOut OK
     * @throws ApiError
     */
    public static getVrchatInstanceByShortName({
        shortName,
    }: {
        /**
         * Instance short/secure name
         */
        shortName: any,
    }): CancelablePromise<VRChatInstanceOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/instances/s/{short_name}',
            path: {
                'short_name': shortName,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Instance not found`,
                422: `short_name required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Get VRChat instance detail
     * @returns VRChatInstanceOut OK
     * @throws ApiError
     */
    public static getVrchatInstance({
        worldId,
        instanceId,
    }: {
        /**
         * VRChat world id
         */
        worldId: any,
        /**
         * VRChat instance id
         */
        instanceId: any,
    }): CancelablePromise<VRChatInstanceOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/instances/{world_id}/{instance_id}',
            path: {
                'world_id': worldId,
                'instance_id': instanceId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Instance not found`,
                422: `world_id or instance_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Request self-invite to VRChat instance
     * Request an invite to an instance for the current bot
     * session.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static selfInviteVrchatInstance({
        worldId,
        instanceId,
    }: {
        /**
         * VRChat world id
         */
        worldId: any,
        /**
         * VRChat instance id
         */
        instanceId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/instances/{world_id}/{instance_id}/invite',
            path: {
                'world_id': worldId,
                'instance_id': instanceId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `world_id or instance_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Invite yourself to VRChat instance
     * Request an invite for yourself to a specific instance.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static inviteMyselfVrchat({
        worldId,
        instanceId,
    }: {
        /**
         * VRChat world id
         */
        worldId: any,
        /**
         * VRChat instance id
         */
        instanceId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/invite/myself/{world_id}/{instance_id}',
            path: {
                'world_id': worldId,
                'instance_id': instanceId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `world_id or instance_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Send VRChat invite to user
     * Invite a VRChat user to a world instance.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static sendVrchatInvite({
        userId,
        requestBody,
    }: {
        /**
         * VRChat user id
         */
        userId: any,
        /**
         * Invite payload
         */
        requestBody: VRChatSendInviteIn,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/invite/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `user_id / worldId / instanceId required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List VRChat notifications
     * Optionally filter by type (invite/friendRequest/...).
     * @returns VRChatNotificationOut OK
     * @throws ApiError
     */
    public static listVrchatNotifications({
        type,
        n,
        offset,
    }: {
        /**
         * Notification type filter
         */
        type?: any,
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatNotificationOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/notifications',
            query: {
                'type': type,
                'n': n,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Accept VRChat notification
     * Accept a notification such as an invite or friend request.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static acceptVrchatNotification({
        notificationId,
    }: {
        /**
         * VRChat notification id
         */
        notificationId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vrchat/notifications/{notification_id}/accept',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `notification_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Hide/delete VRChat notification
     * Delete or hide a notification.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static hideVrchatNotification({
        notificationId,
    }: {
        /**
         * VRChat notification id
         */
        notificationId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vrchat/notifications/{notification_id}/hide',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `notification_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Mark VRChat notification as read
     * Mark a notification as seen/read.
     * @returns VRChatInviteActionOut OK
     * @throws ApiError
     */
    public static markVrchatNotificationRead({
        notificationId,
    }: {
        /**
         * VRChat notification id
         */
        notificationId: any,
    }): CancelablePromise<VRChatInviteActionOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vrchat/notifications/{notification_id}/see',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `notification_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Get presence-sharing consent
     * Returns the caller's presence-sharing consent flags.
     * When no row exists, default off-shape is emitted
     * (share_presence=false, share_with_friends_only=true,
     * allow_join_me=false, store_visit_history=false).
     * @returns PresenceConsentOut OK
     * @throws ApiError
     */
    public static getPresenceConsent(): CancelablePromise<PresenceConsentOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/presence/consent',
            errors: {
                401: `Authentication required`,
                500: `Could not load consent`,
            },
        });
    }
    /**
     * Update presence-sharing consent
     * Partial-update the caller's consent flags. Absent
     * fields leave the column untouched. First write
     * inserts a row with defaults for any unset field.
     * @returns PresenceConsentOut OK
     * @throws ApiError
     */
    public static updatePresenceConsent({
        requestBody,
    }: {
        /**
         * Consent flags to update
         */
        requestBody: PresenceConsentUpdateIn,
    }): CancelablePromise<PresenceConsentOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vrchat/presence/consent',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                500: `Could not update consent`,
            },
        });
    }
    /**
     * Get aggregated event presence
     * PUBLIC. Returns presence reports for the named event
     * in reported_at DESC order. Only includes rows from
     * users who opted in at INSERT time.
     * @returns InstancePresenceOut OK
     * @throws ApiError
     */
    public static getEventPresence({
        eventId,
        limit,
    }: {
        /**
         * Event UUID or evt_<uuid>
         */
        eventId: any,
        /**
         * Max results (1..200, default 50)
         */
        limit?: any,
    }): CancelablePromise<Array<InstancePresenceOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/presence/event/{event_id}',
            path: {
                'event_id': eventId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                400: `Invalid event_id`,
                422: `event_id wrong prefix`,
                500: `Could not load event presence`,
            },
        });
    }
    /**
     * Get own VRChat presence history
     * Returns the authenticated caller's instance-visit
     * history, ordered reported_at DESC. Requires opt-in
     * via PUT /vrchat/presence/consent with
     * store_visit_history=true. 403 when consent missing
     * or off. Optional event_id query param filters to one
     * event.
     * @returns InstancePresenceOut OK
     * @throws ApiError
     */
    public static getPresenceHistory({
        limit,
        eventId,
    }: {
        /**
         * Max results (1..200, default 50)
         */
        limit?: any,
        /**
         * Filter by event UUID or evt_<uuid>
         */
        eventId?: any,
    }): CancelablePromise<Array<InstancePresenceOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/presence/history',
            query: {
                'limit': limit,
                'event_id': eventId,
            },
            errors: {
                401: `Authentication required`,
                403: `Visit history not enabled`,
                422: `Bad query param`,
                500: `Could not load history`,
            },
        });
    }
    /**
     * Mark presence as left
     * Close the caller's most-recent open presence record
     * (left_at IS NULL). Sets left_at to now and computes
     * duration_seconds. 404 when no open record exists.
     * @returns InstancePresenceOut OK
     * @throws ApiError
     */
    public static reportInstanceLeave(): CancelablePromise<InstancePresenceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/presence/leave',
            errors: {
                401: `Authentication required`,
                404: `No open presence record`,
                500: `Could not close presence`,
            },
        });
    }
    /**
     * Report current VRChat instance
     * Record the caller's current VRChat instance. Requires
     * prior opt-in via PUT /vrchat/presence/consent with
     * share_presence=true. 403 when consent missing or off.
     * @returns InstancePresenceOut Created
     * @throws ApiError
     */
    public static reportInstancePresence({
        requestBody,
    }: {
        /**
         * Presence report
         */
        requestBody: InstancePresenceReportIn,
    }): CancelablePromise<InstancePresenceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vrchat/presence/report',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required`,
                403: `Presence consent required`,
                422: `Validation failed`,
                500: `Could not record presence`,
            },
        });
    }
    /**
     * Update VRChat profile (alias)
     * Alias for PATCH /vrchat/user. Same backing call.
     * @returns VRChatUserOut OK
     * @throws ApiError
     */
    public static updateVrchatProfile({
        requestBody,
    }: {
        /**
         * Profile update payload
         */
        requestBody: VRChatProfileUpdateIn,
    }): CancelablePromise<VRChatUserOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vrchat/profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * VRChat profile field length limits
     * Returns the character limits for VRChat profile
     * fields (status, statusDescription, bio). ANON -
     * no authentication required. Constants matched to
     * the VRChat REST API's documented limits.
     * @returns ProfileLimits OK
     * @throws ApiError
     */
    public static getVrchatProfileLimits(): CancelablePromise<ProfileLimits> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/profile/limits',
        });
    }
    /**
     * Get own represented VRChat groups
     * Returns the authenticated user's represented VRChat
     * groups in display_order ASC.
     * @returns RepresentedGroupOut OK
     * @throws ApiError
     */
    public static getRepresentedGroups(): CancelablePromise<Array<RepresentedGroupOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/represented-groups',
            errors: {
                401: `Authentication required`,
                500: `Could not load represented groups`,
            },
        });
    }
    /**
     * Replace represented VRChat groups
     * Atomically replace the authenticated user's list of
     * represented VRChat groups. Up to 20 items; absent
     * fields land as NULL. Returns the post-commit list.
     * @returns RepresentedGroupOut OK
     * @throws ApiError
     */
    public static setRepresentedGroups({
        requestBody,
    }: {
        /**
         * Ordered list of groups
         */
        requestBody: RepresentedGroupSetIn,
    }): CancelablePromise<Array<RepresentedGroupOut>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vrchat/represented-groups',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                422: `Validation failed`,
                500: `Could not replace represented groups`,
            },
        });
    }
    /**
     * Get any user's represented VRChat groups
     * PUBLIC. Returns the named user's represented VRChat
     * groups in display_order ASC. Empty list when user
     * has none.
     * @returns RepresentedGroupOut OK
     * @throws ApiError
     */
    public static getUserRepresentedGroups({
        userId,
    }: {
        /**
         * User id (UUID or usr_<uuid>)
         */
        userId: any,
    }): CancelablePromise<Array<RepresentedGroupOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/represented-groups/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                400: `Invalid user_id`,
                422: `user_id wrong prefix`,
                500: `Could not load represented groups`,
            },
        });
    }
    /**
     * Get current VRChat user
     * Returns the authenticated bot's /auth/user.
     * @returns VRChatUserOut OK
     * @throws ApiError
     */
    public static getVrchatUser(): CancelablePromise<VRChatUserOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/user',
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Update VRChat profile fields
     * Update status / statusDescription / bio. force_update=true
     * clears empty values. 204 when no fields change.
     * @returns VRChatUserOut OK
     * @throws ApiError
     */
    public static updateVrchatUser({
        requestBody,
    }: {
        /**
         * User update payload
         */
        requestBody: VRChatProfileUpdateIn,
    }): CancelablePromise<VRChatUserOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/vrchat/user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List current VRChat user's group instances
     * Group instances the bot is currently in or can join.
     * @returns VRChatInstanceOut OK
     * @throws ApiError
     */
    public static listVrchatUserGroupInstances(): CancelablePromise<Array<VRChatInstanceOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/user/group-instances',
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Verify the bot's membership in a VRChat group
     * Walks the bot's groups list.
     * @returns VRChatGroupVerificationOut OK
     * @throws ApiError
     */
    public static verifyVrchatMembership({
        groupId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
    }): CancelablePromise<VRChatGroupVerificationOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/verify-membership/{group_id}',
            path: {
                'group_id': groupId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Verify another VRChat user's group membership
     * Paginates members and matches by id or userId.
     * @returns VRChatUserVerificationOut OK
     * @throws ApiError
     */
    public static verifyVrchatUserMembership({
        groupId,
        userId,
    }: {
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * VRChat user id
         */
        userId: any,
    }): CancelablePromise<VRChatUserVerificationOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/verify-user-membership/{group_id}/{user_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                422: `group_id or user_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Search VRChat worlds
     * Search worlds with optional filters.
     * @returns VRChatWorldOut OK
     * @throws ApiError
     */
    public static searchVrchatWorlds({
        search,
        featured,
        sort,
        order,
        tag,
        releaseStatus,
        n,
        offset,
    }: {
        /**
         * Search query
         */
        search?: any,
        /**
         * Featured filter
         */
        featured?: any,
        /**
         * Sort field
         */
        sort?: any,
        /**
         * Sort order
         */
        order?: any,
        /**
         * Tag filter
         */
        tag?: any,
        /**
         * Release status filter
         */
        releaseStatus?: any,
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatWorldOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/worlds',
            query: {
                'search': search,
                'featured': featured,
                'sort': sort,
                'order': order,
                'tag': tag,
                'release_status': releaseStatus,
                'n': n,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List active VRChat worlds
     * Populated worlds.
     * @returns VRChatWorldOut OK
     * @throws ApiError
     */
    public static listActiveVrchatWorlds({
        n,
        offset,
    }: {
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatWorldOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/worlds/active',
            query: {
                'n': n,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List favorite VRChat worlds
     * Bot's favourite worlds.
     * @returns VRChatWorldOut OK
     * @throws ApiError
     */
    public static listFavoriteVrchatWorlds({
        n,
        offset,
    }: {
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatWorldOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/worlds/favorites',
            query: {
                'n': n,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * List recently visited VRChat worlds
     * Worlds the bot has recently visited.
     * @returns VRChatWorldOut OK
     * @throws ApiError
     */
    public static listRecentVrchatWorlds({
        n,
        offset,
    }: {
        /**
         * Max results (default 60)
         */
        n?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<Array<VRChatWorldOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/worlds/recent',
            query: {
                'n': n,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `No active bot configured`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Get VRChat world detail
     * @returns VRChatWorldOut OK
     * @throws ApiError
     */
    public static getVrchatWorld({
        worldId,
    }: {
        /**
         * VRChat world id (wrld_<uuid>)
         */
        worldId: any,
    }): CancelablePromise<VRChatWorldOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vrchat/worlds/{world_id}',
            path: {
                'world_id': worldId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                404: `World not found`,
                422: `world_id required`,
                502: `Upstream VRChat error`,
                504: `VRChat upstream timed out`,
            },
        });
    }
}
