/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VRChatBotJoinGroupOut } from '../models/VRChatBotJoinGroupOut';
import type { VRChatBotSetupRoleIn } from '../models/VRChatBotSetupRoleIn';
import type { VRChatGroupRoleOut } from '../models/VRChatGroupRoleOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VrchatBotsService {
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
}
