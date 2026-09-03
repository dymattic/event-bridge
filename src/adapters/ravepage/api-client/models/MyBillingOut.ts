/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingAccountOut } from './BillingAccountOut';
import type { BillingSubscriptionOut } from './BillingSubscriptionOut';
import type { EntitlementOut } from './EntitlementOut';
export type MyBillingOut = {
    account?: BillingAccountOut;
    /**
     * Entitlements is the resolved entitlement list (one per
     * distinct feature key). MUST emit as `[]` when empty -
     * never `null`.
     */
    entitlements?: Array<EntitlementOut>;
    /**
     * GroupAccounts is the list of group-owned accounts the
     * caller has access to. FE
     * consumers that depend on this field should not regress when
     * it lights up.
     */
    group_accounts?: Array<BillingAccountOut>;
    /**
     * Subscription is the current non-terminal subscription, or
     * null in the (transient) state between cancellation and
     * free-plan fallback.
     */
    subscription?: BillingSubscriptionOut;
};

