/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonalMetricRejectionOut } from './PersonalMetricRejectionOut';
export type PersonalMetricIngestOut = {
    /**
     * Accepted is how many occurrences produced an edge write.
     */
    accepted?: number;
    /**
     * Duplicate is how many were dropped because their occurrence_id
     * had already been seen inside the retention window. Not an error.
     */
    duplicate?: number;
    /**
     * Rejected lists occurrences the server refused, with reasons.
     */
    rejected?: Array<PersonalMetricRejectionOut>;
};

