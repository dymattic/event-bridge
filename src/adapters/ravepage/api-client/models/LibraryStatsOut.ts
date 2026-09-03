/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LibraryFacetCountOut } from './LibraryFacetCountOut';
export type LibraryStatsOut = {
    /**
     * Artists facet (raw artist_text).
     */
    artists?: Array<LibraryFacetCountOut>;
    /**
     * Genres facet.
     */
    genres?: Array<LibraryFacetCountOut>;
    /**
     * Keys facet (musical key).
     */
    keys?: Array<LibraryFacetCountOut>;
    /**
     * Labels facet.
     */
    labels?: Array<LibraryFacetCountOut>;
    /**
     * Linked rows (canonical_track_id resolved).
     */
    linked?: number;
    /**
     * Total library rows.
     */
    total?: number;
};

