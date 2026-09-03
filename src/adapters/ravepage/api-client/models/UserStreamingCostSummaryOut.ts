/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CloudflareStreamUsageOut } from './CloudflareStreamUsageOut';
import type { HetznerStorageUsageOut } from './HetznerStorageUsageOut';
export type UserStreamingCostSummaryOut = {
    calculated_at?: string;
    cloudflare?: CloudflareStreamUsageOut;
    eur_to_usd_rate?: number;
    hetzner?: HetznerStorageUsageOut;
    total_estimated_cost_usd?: number;
    user_id?: string;
};

