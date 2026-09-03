/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilterGroupFeedItemEntityOut } from './FilterGroupFeedItemEntityOut';
export type FilterGroupFeedItemOut = {
    /**
     * Entity - full hydration; always null in v1.
     */
    entity?: FilterGroupFeedItemEntityOut;
    entity_id?: string;
    /**
     * EntityType - event / user / performer / etc.
     */
    entity_type?: string;
    /**
     * Reasons - why-recommended tags.
     */
    reasons?: Array<string>;
    /**
     * Source - which generator produced this item.
     */
    source?: string;
};

