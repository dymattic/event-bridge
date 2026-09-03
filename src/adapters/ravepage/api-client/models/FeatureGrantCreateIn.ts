/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FeatureGrantCreateIn = {
    /**
     * ExpiresAt is when the grant expires. nil = permanent (until
     * revoked).
     */
    expires_at?: string;
    /**
     * FeatureKey is the feature being granted. Validated against
     * the canonical FeatureKey enum server-side - unknown keys are
     * rejected with 400 + `Unknown feature_key '<x>'. See FeatureKey
     * enum for valid values.` matching parity at
     */
    feature_key?: string;
    /**
     * IncludedQuota is the extra quota to add (or override for
     * boolean gates). nil = unlimited (only meaningful for metered
     * features). For boolean-gate features the value is ignored.
     */
    included_quota?: number;
    /**
     * QuotaUnit is the unit label. When omitted, defaults to the
     * feature's canonical unit `).
     */
    quota_unit?: string;
    /**
     * Reason is the human-readable reason stored for audit
     * (e.g. "Q2 promo", "goodwill refund").
     */
    reason?: string;
};

