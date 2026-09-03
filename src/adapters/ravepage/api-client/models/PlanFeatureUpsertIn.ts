/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlanFeatureUpsertIn = {
    /**
     * IncludedQuota - null = unlimited; 0 = explicitly disabled.
     */
    included_quota?: number;
    /**
     * OveragePriceEurNetCents - net price per unit beyond quota;
     * null = hard cap.
     */
    overage_price_eur_net_cents?: number;
    /**
     * QuotaUnit defaults to the feature's canonical unit.
     */
    quota_unit?: string;
};

