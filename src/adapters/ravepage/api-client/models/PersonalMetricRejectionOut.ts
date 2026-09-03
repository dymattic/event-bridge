/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PersonalMetricRejectionOut = {
    /**
     * OccurrenceID of the refused occurrence.
     */
    occurrence_id?: string;
    /**
     * Reason is a stable machine code.
     */
    reason?: 'invalid_occurrence_id' | 'invalid_entity_type' | 'invalid_entity_id' | 'unresolved_entity' | 'invalid_occurred_at';
};

