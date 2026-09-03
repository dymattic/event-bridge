/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MyFeatureOut = {
    /**
     * Allowed is the single gate: Enabled && (!IsPaywalled || Entitled).
     */
    allowed?: boolean;
    /**
     * Enabled is the resolved FLAG value (global default + overrides).
     */
    enabled?: boolean;
    /**
     * Entitled reports whether the user's billing account has the
     * feature via plan or grant. Always true for non-paywalled flags.
     */
    entitled?: boolean;
    /**
     * EntitlementSource is "plan", "grant", "plan+grant" or "" when
     * not entitled.
     */
    entitlement_source?: string;
    feature_key?: string;
    /**
     * FlagSource explains the flag resolution: "default",
     * "group_override", "user_override".
     */
    flag_source?: string;
    /**
     * IncludedQuota / QuotaUnit mirror the resolved entitlement for
     * metered features (null = unlimited or boolean gate).
     */
    included_quota?: number;
    is_paywalled?: boolean;
    quota_unit?: string;
};

