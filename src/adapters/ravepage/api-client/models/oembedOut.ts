/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type oembedOut = {
    /**
     * AuthorName is the preview's author/owner display name.
     */
    author_name?: string;
    /**
     * ProviderName / ProviderURL identify rave.page.
     */
    provider_name?: string;
    provider_url?: string;
    thumbnail_height?: number;
    /**
     * Thumbnail* mirror the preview's primary image. Width/height only
     * when known (synthetic cards claim 1200x630; hot-linked real
     * imagery claims nothing).
     */
    thumbnail_url?: string;
    thumbnail_width?: number;
    /**
     * Title is the resolved preview title.
     */
    title?: string;
    /**
     * Type is always "link" - rave.page previews carry no embeddable
     * html payload yet.
     */
    type?: string;
    /**
     * Version is always "1.0" (spec-required).
     */
    version?: string;
};

