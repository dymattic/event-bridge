/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminPlanFeatureOut = {
    feature_key?: string;
    /**
     * ID is the prefixed feature-row identifier ("plf_<uuid>").
     */
    id?: string;
    included_quota?: number;
    /**
     * OveragePriceEurNetCents is the net price charged per unit
     * beyond the included quota. Null = no overage billing (hard
     * cap).
     */
    overage_price_eur_net_cents?: number;
    quota_unit?: string;
};

