/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { YouTubeQuotaEndpoint } from './YouTubeQuotaEndpoint';
export type YouTubeQuotaDay = {
    /**
     * ByEndpoint - per-endpoint split, descending units. Non-nil
     * (empty → `[]`).
     */
    by_endpoint?: Array<YouTubeQuotaEndpoint>;
    /**
     * Date - "YYYY-MM-DD" (UTC bucket; conservative vs YT's midnight-
     * Pacific reset by up to 8h).
     */
    date?: string;
    /**
     * TotalUnits - the day's summed unit spend.
     */
    total_units?: number;
};

