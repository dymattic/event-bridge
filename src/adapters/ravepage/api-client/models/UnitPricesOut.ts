/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UnitPricesOut = {
    currency?: string;
    snapshot_gb_month_net_micros?: number;
    stale?: boolean;
    /**
     * StorageGBMonthNetMicros - block-volume price, net micro-cents per
     * GB-month (micros avoid sub-cent truncation on the wire).
     */
    storage_gb_month_net_micros?: number;
    /**
     * TrafficTBNetMicros - overage price per TB, net micro-cents.
     */
    traffic_tb_net_micros?: number;
    /**
     * VATRateBps is the Hetzner VAT rate in basis points (e.g. 1900 =
     * 19%). Mirrors the billing plan editor's `vat_rate_bps` unit.
     */
    vat_rate_bps?: number;
};

