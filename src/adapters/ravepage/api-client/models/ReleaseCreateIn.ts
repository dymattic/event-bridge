/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReleaseCreateIn = {
    /**
     * CoverImageURL points at the cover-art asset; optional.
     */
    cover_image_url?: string;
    /**
     * Description is optional long-form copy.
     */
    description?: string;
    /**
     * ReleaseDate is the wall-clock date the release became public.
     * Accepts RFC3339, ISO8601, or YYYY-MM-DD at the route boundary.
     */
    release_date?: string;
    /**
     * Optional; nil leaves it NULL in storage.
     */
    release_type?: 'single' | 'ep' | 'album' | 'compilation' | 'dj_set';
    /**
     * Title is the human-readable release name. Required.
     */
    title?: string;
    /**
     * Visibility is one of: public, unlisted, logged_in, private.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

