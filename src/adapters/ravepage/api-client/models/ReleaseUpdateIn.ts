/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReleaseUpdateIn = {
    /**
     * CoverImageURL overrides the cover image URL.
     */
    cover_image_url?: string;
    /**
     * Description overrides the release description.
     */
    description?: string;
    /**
     * ReleaseDate overrides the release date.
     */
    release_date?: string;
    /**
     * ReleaseType overrides the release_type enum.
     */
    release_type?: 'single' | 'ep' | 'album' | 'compilation' | 'dj_set';
    /**
     * Title overrides the existing release title. Omit to leave alone.
     */
    title?: string;
    /**
     * Visibility overrides the visibility scope. Must be one of the
     * four canonical values; omit to leave alone.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

