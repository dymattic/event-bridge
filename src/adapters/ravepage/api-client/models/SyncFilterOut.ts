/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SyncFilterOut = {
    /**
     * CaseSensitive toggles case-sensitive matching.
     */
    case_sensitive?: boolean;
    /**
     * FilterType is include | exclude.
     */
    filter_type?: string;
    /**
     * ID is the filter id.
     */
    id?: string;
    /**
     * MatchField is title | description | appointment_type.
     */
    match_field?: string;
    /**
     * MatchValue is the substring to match.
     */
    match_value?: string;
    /**
     * SyncRuleID is the owning rule.
     */
    sync_rule_id?: string;
};

