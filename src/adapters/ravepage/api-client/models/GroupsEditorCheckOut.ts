/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GroupsEditorCheckOut = {
    /**
     * IsEditor - true when EITHER arm succeeded. False for `none`
     * and `group_not_found`.
     */
    is_editor?: boolean;
    /**
     * Reason - which arm matched. Stable enum for observability +
     * per-caller status-code mapping.
     */
    reason?: 'admin' | 'role' | 'none' | 'group_not_found';
    /**
     * Role - the caller's raw `group_memberships.role` value when
     * the role arm matched. Empty string for admin / none /
     * group_not_found. Useful for callers that want to surface the
     * caller's role tier (e.g. owner vs manager) on the response.
     */
    role?: string;
};

