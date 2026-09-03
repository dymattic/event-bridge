/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilterOption } from './FilterOption';
export type FilterOptionsResponse = {
    accessibility_flags?: Array<FilterOption>;
    age_flags?: Array<FilterOption>;
    /**
     * Genres - taxonomy roots from tracks worker; `[]` on adapter failure.
     */
    genres?: Array<FilterOption>;
    /**
     * Hosts is the top-20 upcoming-event hosts by event count
     * (events-owned local query - no cross-worker reach).
     */
    hosts?: Array<FilterOption>;
    languages?: Array<FilterOption>;
    platforms?: Array<FilterOption>;
    restriction_flags?: Array<FilterOption>;
    /**
     * Subgenres - taxonomy children from tracks worker; `[]` on adapter failure.
     */
    subgenres?: Array<FilterOption>;
};

