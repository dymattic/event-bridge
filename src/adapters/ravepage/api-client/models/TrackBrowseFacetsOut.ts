/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LibraryFacetCountOut } from './LibraryFacetCountOut';
export type TrackBrowseFacetsOut = {
    /**
     * Camelots - every Camelot code present among key winners
     * (value = wheel code like "8A"; max 24), count DESC then wheel
     * order.
     */
    camelots?: Array<LibraryFacetCountOut>;
    /**
     * Genres - top-100 genre winners (display value), count DESC then
     * value ASC.
     */
    genres?: Array<LibraryFacetCountOut>;
    /**
     * Labels - top-100 label winners, same ordering.
     */
    labels?: Array<LibraryFacetCountOut>;
    /**
     * Total is the canonical-catalog track count.
     */
    total?: number;
};

