/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CostLineItemOut } from './CostLineItemOut';
export type ProviderCostOut = {
    /**
     * Configured is false when the provider's credential is unset - the
     * money fields are then 0 and Note explains what to add.
     */
    configured?: boolean;
    currency?: string;
    line_items?: Array<CostLineItemOut>;
    monthly_gross_cents?: number;
    monthly_net_cents?: number;
    note?: string;
    /**
     * Provider is a stable key: "hetzner_cloud" | "hetzner_robot" |
     * "cloudflare".
     */
    provider?: string;
};

