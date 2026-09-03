/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventGenreTagsRow } from './EventGenreTagsRow';
export type ListEventGenreTagsPageOut = {
    /**
     * Events is the page of tag-carrying events. Always non-nil.
     */
    events?: Array<EventGenreTagsRow>;
    /**
     * NextAfterID is the `id` half of the next-page cursor (bare UUID).
     * Empty when the corpus is exhausted.
     */
    next_after_id?: string;
    /**
     * NextAfterUpdatedAt is the `updated_at` half of the next-page
     * cursor (RFC3339). Empty when the corpus is exhausted.
     */
    next_after_updated_at?: string;
};

