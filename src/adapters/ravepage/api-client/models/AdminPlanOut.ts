/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminPlanFeatureOut } from './AdminPlanFeatureOut';
export type AdminPlanOut = {
    billing_period?: string;
    code?: string;
    created_at?: string;
    description?: string;
    display_order?: number;
    /**
     * Features - MUST emit `[]` on a plan with zero rows.
     */
    features?: Array<AdminPlanFeatureOut>;
    /**
     * ID is the prefixed plan-row identifier ("pln_<uuid>").
     */
    id?: string;
    is_active?: boolean;
    is_public?: boolean;
    name?: string;
    price_eur_net_cents?: number;
    stripe_price_id?: string;
    trial_days?: number;
    updated_at?: string;
    vat_rate_bps?: number;
};

