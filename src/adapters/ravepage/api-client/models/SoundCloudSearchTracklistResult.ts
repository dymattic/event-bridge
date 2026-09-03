/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudSearchSuggestion } from './SoundCloudSearchSuggestion';
export type SoundCloudSearchTracklistResult = {
    /**
     * Error - non-empty when SC failed for this query OR the query
     * was empty. The full batch never aborts on a single failure.
     */
    error?: string;
    /**
     * ItemID - bare UUID string of the source tracklist_item. Echoed
     * verbatim from the request.
     */
    item_id?: string;
    /**
     * SearchQuery - verbatim copy of the input `Query` so tracks can
     * echo it back to the FE without re-deriving.
     */
    search_query?: string;
    /**
     * Suggestions - SC results for this query (may be empty).
     */
    suggestions?: Array<SoundCloudSearchSuggestion>;
};

