/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlanFeatureOut } from './PlanFeatureOut';
export type PlanOut = {
    /**
     * BillingPeriod is one of "month" | "year" | "once".
     */
    billing_period?: string;
    /**
     * Code is the stable machine code (e.g. "free", "pro", "team").
     */
    code?: string;
    /**
     * Description is the marketing description.
     */
    description?: string;
    /**
     * DisplayOrder is the sort order on the pricing page. Lower
     * values render first.
     */
    display_order?: number;
    /**
     * Features is the list of included features and per-period
     * quotas. MUST emit as `[]` on a plan with zero feature rows
     * (never `null`).
     */
    features?: Array<PlanFeatureOut>;
    /**
     * ID is the prefixed plan-row identifier ("pln_<uuid>").
     */
    id?: string;
    /**
     * Name is the display name.
     */
    name?: string;
    /**
     * PriceEurNetCents is the net price in EUR cents. VAT is added
     * at invoice time per §14 UStG.
     */
    price_eur_net_cents?: number;
    /**
     * TrialDays is the free-trial length in days (0 for none).
     */
    trial_days?: number;
    /**
     * VatRateBPS is the default VAT rate in basis points (1900 =
     * 19.00%). Overridden to 0 when Kleinunternehmer §19 is enabled
     * site-wide.
     */
    vat_rate_bps?: number;
};

