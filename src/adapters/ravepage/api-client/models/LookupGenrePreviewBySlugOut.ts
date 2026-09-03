/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GenrePreviewParent } from './GenrePreviewParent';
export type LookupGenrePreviewBySlugOut = {
    /**
     * Description ("" when null).
     */
    description?: string;
    /**
     * GenreID is the bare-UUID string of the matched genres row.
     */
    genre_id?: string;
    /**
     * Name is the genre display name.
     */
    name?: string;
    /**
     * Parent is set when parent_genre_id resolves; null otherwise.
     * Parent resolution is fail-soft producer-side (a parent-row read
     * error drops the block, never the preview).
     */
    parent?: GenrePreviewParent;
    /**
     * Slug is the canonical genre slug.
     */
    slug?: string;
};

