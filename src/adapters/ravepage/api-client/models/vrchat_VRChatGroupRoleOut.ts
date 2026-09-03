/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type vrchat_VRChatGroupRoleOut = {
    /**
     * Description - VRChat's `description`. Empty when absent.
     */
    description?: string;
    /**
     * IsSelfAssignable - VRChat's `isSelfAssignable` flag.
     */
    is_self_assignable?: boolean;
    /**
     * Name - VRChat's `name`. Defaults to "Unnamed" when upstream
     * returned NULL/empty; truncated to 255 chars (matches
     */
    name?: string;
    /**
     * Order - VRChat's `order`. Defaults to 0 when absent.
     */
    order?: number;
    /**
     * Permissions - VRChat's `permissions` list. Empty list when
     * absent. Never nil.
     */
    permissions?: Array<string>;
    /**
     * VRChatRoleID - VRChat's `id` field. Opaque string. Required;
     * roles without an upstream id are filtered out.
     */
    vrchat_role_id?: string;
};

