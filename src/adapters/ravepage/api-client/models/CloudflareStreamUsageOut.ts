/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CloudflareStreamUsageOut = {
    delivery_cost_usd?: number;
    storage_cost_usd?: number;
    total_cf_cost_usd?: number;
    total_delivery_minutes?: number;
    total_storage_minutes?: number;
    /**
     * UserID is `usr_<uuid>` per project convention.
     */
    user_id?: string;
};

