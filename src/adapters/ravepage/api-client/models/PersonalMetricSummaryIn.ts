/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PersonalMetricSummaryIn = {
    /**
     * Limit caps items per stat (1..200, default 50).
     */
    limit?: number;
    /**
     * StatKeys narrows the read. Empty means every stat.
     */
    stat_keys?: Array<string>;
    /**
     * SubjectID selects the private rows to read. Omit to read only the
     * public (user_id-keyed) rows.
     */
    subject_id?: string;
};

