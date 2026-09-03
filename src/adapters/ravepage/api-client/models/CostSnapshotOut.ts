/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderCostOut } from './ProviderCostOut';
import type { StorageOut } from './StorageOut';
export type CostSnapshotOut = {
    breakdown?: Record<string, number>;
    /**
     * Cached is true when served from a persisted snapshot (the common
     * path). False when this response was computed live (refresh, or a
     * current-miss fallback).
     */
    cached?: boolean;
    captured_at?: string;
    currency?: string;
    grand_total_monthly_gross_cents?: number;
    /**
     * GrandTotal folds every configured provider (cloud + dedicated +
     * cloudflare). This is the dashboard's headline number.
     */
    grand_total_monthly_net_cents?: number;
    monthly_runrate_gross_cents?: number;
    monthly_runrate_net_cents?: number;
    projected_month_end_net_cents?: number;
    /**
     * Providers is the per-provider cost breakdown (hetzner_cloud +
     * hetzner_robot dedicated + cloudflare). The persisted snapshot money
     * fields above cover hetzner_cloud only; robot + cloudflare are a
     * live overlay composed on read. Each provider degrades cleanly
     * (Configured=false + Note) when its credential is unset.
     */
    providers?: Array<ProviderCostOut>;
    resource_counts?: Record<string, any>;
    /**
     * Stale is true when NO snapshot exists yet and the live fallback
     * also failed (Hetzner unreachable) - every money field is then 0.
     */
    stale?: boolean;
    storage?: StorageOut;
};

