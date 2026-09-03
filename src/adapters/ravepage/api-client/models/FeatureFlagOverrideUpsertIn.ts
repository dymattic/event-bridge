/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FeatureFlagOverrideUpsertIn = {
    enabled?: boolean;
    expires_at?: string;
    reason?: string;
    /**
     * ScopeID is the scoped entity ("usr_<uuid>" / "grp_<uuid>" or
     * bare UUID).
     */
    scope_id?: string;
    /**
     * ScopeType is "group" or "user".
     */
    scope_type?: string;
};

