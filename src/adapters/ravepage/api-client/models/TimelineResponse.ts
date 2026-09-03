/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TimelineSection } from './TimelineSection';
export type TimelineResponse = {
    /**
     * GeneratedAt is the response generation timestamp.
     */
    generated_at?: string;
    /**
     * Sections is the list of non-empty timeline sections in render
     * order (live_now → past).
     */
    sections?: Array<TimelineSection>;
    /**
     * StaleAfter is the recommended-refresh time (now + 2 minutes).
     */
    stale_after?: string;
    /**
     * TotalCount is the total number of events across all sections.
     */
    total_count?: number;
};

