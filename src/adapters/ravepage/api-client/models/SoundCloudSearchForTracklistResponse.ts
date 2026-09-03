/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudSearchTracklistResult } from './SoundCloudSearchTracklistResult';
export type SoundCloudSearchForTracklistResponse = {
    /**
     * FailedSearches - rows with no suggestions (either empty query
     * or SC error).
     */
    failed_searches?: number;
    /**
     * Results - one row per input query, same order.
     */
    results?: Array<SoundCloudSearchTracklistResult>;
    /**
     * SuccessfulSearches - count of rows where SC returned at least
     * one suggestion. Echoed by the caller into the user-facing
     * envelope.
     */
    successful_searches?: number;
    /**
     * TotalSuggestions - sum of suggestion counts across all rows.
     */
    total_suggestions?: number;
};

