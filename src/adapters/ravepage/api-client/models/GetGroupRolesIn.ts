/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GetGroupRolesIn = {
    /**
     * CallerUserID - bare-UUID string. Used only for logging /
     * observability; the vrchat-bot session is what gets used for
     * the actual upstream call. Empty allowed (system-principal
     * internal flows).
     */
    caller_user_id?: string;
    /**
     * VRChatGroupID - opaque VRChat group ID (no validation here; the
     * upstream will 404 if missing). REQUIRED.
     */
    vrchat_group_id?: string;
};

