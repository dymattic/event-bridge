/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CostLineItemOut = {
    /**
     * Kind labels how the figure was derived: "cloud" | "dedicated" |
     * "subscription" | "usage" | "estimate". "estimate" = usage-metered
     * product priced from public per-unit rates (not an invoice figure).
     */
    kind?: string;
    monthly_gross_cents?: number;
    monthly_net_cents?: number;
    note?: string;
    product?: string;
};

