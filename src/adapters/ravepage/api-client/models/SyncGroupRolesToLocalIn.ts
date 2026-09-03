/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SyncGroupRolesToLocalIn = {
    /**
     * CallerUserID - bare-UUID of the admin who triggered the sync.
     * Logged for audit; empty allowed for system-principal flows.
     */
    caller_user_id?: string;
    /**
     * LocalGroupID - bare-UUID string of the Rave.Page group. Carried
     * through so the report can echo it for audit/observability.
     * REQUIRED.
     */
    local_group_id?: string;
    /**
     * VRChatGroupID - opaque VRChat group ID. REQUIRED.
     */
    vrchat_group_id?: string;
};

