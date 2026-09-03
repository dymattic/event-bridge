/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminMediaPipelineItemOut } from './AdminMediaPipelineItemOut';
export type AdminMediaPipelineListOut = {
    /**
     * CountsByStatus is the histogram across the whole table
     * (filter NOT applied) - drives the admin triage summary card.
     */
    counts_by_status?: Record<string, number>;
    /**
     * Items is the page of pipeline rows.
     */
    items?: Array<AdminMediaPipelineItemOut>;
    /**
     * Total is the count across all pages (filter applied).
     */
    total?: number;
};

