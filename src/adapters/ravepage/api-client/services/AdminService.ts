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
import type { VRChatBotJoinGroupOut } from '../models/VRChatBotJoinGroupOut';
import type { VRChatBotSetupRoleIn } from '../models/VRChatBotSetupRoleIn';
import type { VRChatGroupRoleOut } from '../models/VRChatGroupRoleOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
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
     * Make a bot join a VRChat group
     * Instructs a bot account to join a VRChat group via the
     * VRChat REST API and persists the resulting membership
     * status + permissions on `vrchat_bot_group_assignments`.
     * Reconciles the "already a member" upstream 400 to a
     * successful sync.
     * @returns VRChatBotJoinGroupOut OK
     * @throws ApiError
     */
    public static botJoinVrchatGroup({
        botId,
        groupId,
    }: {
        /**
         * Bot id (vrcb_<uuid> or UUID)
         */
        botId: any,
        /**
         * VRChat group id
         */
        groupId: any,
    }): CancelablePromise<VRChatBotJoinGroupOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vrchat-bots/{bot_id}/groups/{group_id}/join',
            path: {
                'bot_id': botId,
                'group_id': groupId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Bot account not found`,
                422: `Invalid id`,
                502: `Upstream VRChat error`,
                503: `Bot credentials in legacy format`,
                504: `VRChat upstream timed out`,
            },
        });
    }
    /**
     * Create a management role for the bot in a VRChat group
     * Creates a Rave.Page-bot management role in the VRChat
     * group with instance + queue-priority + moderation
     * permissions, then assigns the role to the bot account.
     * Body is optional - empty body uses the default role
     * name "Rave.Page Bot" and the default permission set.
     * @returns VRChatGroupRoleOut OK
     * @throws ApiError
     */
    public static botSetupGroupRole({
        botId,
        groupId,
        requestBody,
    }: {
        /**
         * Bot id (vrcb_<uuid> or UUID)
         */
        botId: any,
        /**
         * VRChat group id
         */
        groupId: any,
        /**
         * Optional role override (role_name + permissions)
         */
        requestBody?: VRChatBotSetupRoleIn,
    }): CancelablePromise<VRChatGroupRoleOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vrchat-bots/{bot_id}/groups/{group_id}/setup-role',
            path: {
                'bot_id': botId,
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Bot account not found`,
                422: `Validation failed (length / required)`,
                502: `VRChat role-create failed`,
                503: `Bot credentials in legacy format`,
                504: `VRChat upstream timed out`,
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
}
