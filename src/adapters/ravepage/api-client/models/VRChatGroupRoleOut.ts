/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatGroupRoleOut = {
    /**
     * Creation timestamp.
     */
    createdAt?: string;
    /**
     * Role description.
     */
    description?: string;
    /**
     * Parent group id.
     */
    groupId?: string;
    /**
     * Role id.
     */
    id?: string;
    /**
     * Whether this is a management role.
     */
    isManagementRole?: boolean;
    /**
     * Whether role is self-assignable.
     */
    isSelfAssignable?: boolean;
    /**
     * Role name.
     */
    name?: string;
    /**
     * Display order.
     */
    order?: number;
    /**
     * Role permissions.
     */
    permissions?: Array<string>;
    /**
     * Whether 2FA is required.
     */
    requiresTwoFactor?: boolean;
    /**
     * Last update timestamp.
     */
    updatedAt?: string;
};

