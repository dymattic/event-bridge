/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlanCreateIn = {
    /**
     * BillingPeriod is "month" | "year" | "once"; defaults "month".
     */
    billing_period?: string;
    /**
     * Code is the stable machine code (unique, e.g. "pro_2026").
     */
    code?: string;
    description?: string;
    display_order?: number;
    is_active?: boolean;
    is_public?: boolean;
    name?: string;
    price_eur_net_cents?: number;
    trial_days?: number;
    /**
     * VatRateBPS defaults to 1900 when omitted.
     */
    vat_rate_bps?: number;
};

