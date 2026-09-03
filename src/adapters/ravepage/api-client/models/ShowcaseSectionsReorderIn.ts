/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShowcaseSectionReorderItem } from './ShowcaseSectionReorderItem';
export type ShowcaseSectionsReorderIn = {
    /**
     * Items is the array of (section_id, order_index) tuples.
     * Items not present in the payload are untouched. Empty
     * payload → 204 no-op .
     */
    items?: Array<ShowcaseSectionReorderItem>;
};

