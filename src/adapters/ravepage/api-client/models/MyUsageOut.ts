/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UsageMeterOut } from './UsageMeterOut';
export type MyUsageOut = {
    /**
     * BillingAccountID is the prefixed personal billing-account id
     * ("ba_<uuid>"). Auto-created on first call.
     */
    billing_account_id?: string;
    /**
     * Meters is the list of metered features. MUST emit `[]` not
     * `null` when zero meters.
     */
    meters?: Array<UsageMeterOut>;
};

