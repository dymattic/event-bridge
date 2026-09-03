/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { vrchat_VRChatGroupRoleOut } from './vrchat_VRChatGroupRoleOut';
export type RoleSyncReportOut = {
    /**
     * GroupID - local Rave.Page group UUID (echoed from request).
     */
    group_id?: string;
    /**
     * Items - the upstream role catalogue. Consumer iterates this
     * list to compute the merge counts. Always non-nil.
     */
    items?: Array<vrchat_VRChatGroupRoleOut>;
    /**
     * VRChatGroupID - upstream VRChat group ID (echoed from request).
     */
    vrchat_group_id?: string;
};

