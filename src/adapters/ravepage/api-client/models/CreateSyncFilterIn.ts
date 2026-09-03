/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSyncFilterIn = {
    /**
     * CaseSensitive - defaults false.
     */
    case_sensitive?: boolean;
    /**
     * FilterType - include | exclude. Required.
     */
    filter_type?: string;
    /**
     * MatchField - title | description | appointment_type. Required.
     */
    match_field?: string;
    /**
     * MatchValue - substring to match. Required.
     */
    match_value?: string;
};

