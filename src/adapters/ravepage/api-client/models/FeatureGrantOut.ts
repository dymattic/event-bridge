/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FeatureGrantOut = {
    /**
     * BillingAccountID is the prefixed billing-account identifier
     * ("ba_<uuid>") this grant applies to.
     */
    billing_account_id?: string;
    /**
     * ExpiresAt is when the grant expires (null = permanent).
     */
    expires_at?: string;
    /**
     * FeatureKey is the feature granted.
     */
    feature_key?: string;
    /**
     * GrantedAt is when the grant was issued (UTC).
     */
    granted_at?: string;
    /**
     * GrantedByUserID is the prefixed user identifier ("usr_<uuid>")
     * of the admin who issued the grant, or null when system-issued.
     */
    granted_by_user_id?: string;
    /**
     * ID is the prefixed grant identifier ("fgr_<uuid>").
     */
    id?: string;
    /**
     * IncludedQuota is the extra quota beyond the plan; nil =
     * unlimited.
     */
    included_quota?: number;
    /**
     * QuotaUnit is the unit label.
     */
    quota_unit?: string;
    /**
     * Reason is the reason the grant was issued.
     */
    reason?: string;
};

