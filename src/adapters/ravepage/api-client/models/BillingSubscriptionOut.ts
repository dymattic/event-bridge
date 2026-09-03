/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BillingSubscriptionOut = {
    /**
     * BillingAccountID is the prefixed billing-account identifier
     * ("ba_<uuid>").
     */
    billing_account_id?: string;
    cancel_at_period_end?: boolean;
    canceled_at?: string;
    current_period_end?: string;
    current_period_start?: string;
    /**
     * ID is the prefixed subscription identifier ("bsub_<uuid>").
     */
    id?: string;
    /**
     * PlanCode is the plan's stable machine code (e.g. "free",
     * "pro"). plan_code`.
     */
    plan_code?: string;
    /**
     * PlanID is the prefixed plan identifier ("pln_<uuid>").
     */
    plan_id?: string;
    /**
     * Status is one of: "trialing" | "active" | "past_due" |
     * "canceled" | "expired".
     */
    status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired';
    trial_end?: string;
};

