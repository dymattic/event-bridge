/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EntitlementOut = {
    /**
     * Enabled is whether the feature is enabled at all.
     */
    enabled?: boolean;
    /**
     * FeatureKey is the stable feature key (e.g. `storage.quota`).
     */
    feature_key?: string;
    /**
     * IncludedQuota is the combined plan + grant quota. nil =
     * unlimited (only meaningful when Enabled is true).
     */
    included_quota?: number;
    /**
     * QuotaUnit is the unit label (matching
     * `app.core.features.QuotaUnit`). nil for boolean gates.
     */
    quota_unit?: string;
    /**
     * Source is one of "plan" | "grant" | "plan+grant" -
     * indicating where the entitlement came from. Useful for the
     * billing UI to explain why the user has access.
     */
    source?: string;
};

