/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlanFeatureOut = {
    /**
     * FeatureKey is the stable feature key (e.g. `storage.quota`,
     * `vod_minutes`). Consumed by the entitlement RPC + usage-meter
     * rollups.
     */
    feature_key?: string;
    /**
     * ID is the prefixed feature-row identifier ("plf_<uuid>").
     */
    id?: string;
    /**
     * IncludedQuota is the quota included per billing period. `nil`
     * (null on the wire) means unlimited; `0` means explicitly
     * disabled (handy when a plan inherits a feature and then
     * disables it).
     */
    included_quota?: number;
    /**
     * QuotaUnit is the unit label matching `QuotaUnit` ("bytes",
     * "minutes", "calls", ...). `nil` for boolean gates.
     */
    quota_unit?: string;
};

