/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerGenreTagsRow } from './PerformerGenreTagsRow';
export type ListPerformerGenreTagsPageOut = {
    /**
     * NextAfter is the performer_id cursor for the next page. Empty when
     * the corpus is exhausted.
     */
    next_after?: string;
    /**
     * Performers is the page of tag-carrying performers. Always non-nil.
     */
    performers?: Array<PerformerGenreTagsRow>;
};

