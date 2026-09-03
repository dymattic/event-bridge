/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VRChatGroupMyMemberOut } from './VRChatGroupMyMemberOut';
import type { VRChatGroupRoleOut } from './VRChatGroupRoleOut';
export type VRChatGroupPermissionsOut = {
    /**
     * VRChat group id.
     */
    group_id?: string;
    /**
     * User's membership details.
     */
    membership?: VRChatGroupMyMemberOut;
    /**
     * All roles in this group.
     */
    roles?: Array<VRChatGroupRoleOut>;
};

