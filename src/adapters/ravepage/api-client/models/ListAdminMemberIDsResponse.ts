/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListAdminMemberIDsResponse = {
    /**
     * Count is len(user_ids), denormalized for FE/caller convenience.
     */
    count?: number;
    /**
     * GroupID echoes the path param (bare UUID) for correlation.
     */
    group_id?: string;
    /**
     * UserIDs is the sorted bare-UUID set of owner/admin/manager
     * members. `[]` (never null) when the group has none.
     */
    user_ids?: Array<string>;
};

