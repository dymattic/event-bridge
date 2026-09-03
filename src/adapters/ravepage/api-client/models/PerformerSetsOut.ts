/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerSetSummaryOut } from './PerformerSetSummaryOut';
export type PerformerSetsOut = {
    /**
     * Count is the number of sets in this response page.
     */
    count?: number;
    /**
     * PerformerID is the performer (`perf_<uuid>`), echoed for client
     * correlation.
     */
    performer_id?: string;
    /**
     * Sets are the performer's public ended sets, newest-first. Never
     * null (empty slice when the performer has no public sets).
     */
    sets?: Array<PerformerSetSummaryOut>;
};

