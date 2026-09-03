/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FeatureFlagOverrideOut = {
    created_at?: string;
    /**
     * CreatedByUserID is "usr_<uuid>" of the issuing admin.
     */
    created_by_user_id?: string;
    /**
     * Enabled is the override value (wins over the global default;
     * user scope wins over group scope).
     */
    enabled?: boolean;
    expires_at?: string;
    feature_key?: string;
    /**
     * ID is the prefixed override identifier ("ffo_<uuid>").
     */
    id?: string;
    reason?: string;
    /**
     * ScopeID is the prefixed scoped-entity id ("usr_<uuid>" /
     * "grp_<uuid>").
     */
    scope_id?: string;
    /**
     * ScopeType is "group" or "user".
     */
    scope_type?: string;
};

