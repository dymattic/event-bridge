/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShowcaseSectionCreateIn = {
    /**
     * ClientID is the optional FE-side correlation id.
     */
    client_id?: string;
    /**
     * Config is the freeform section-config JSON object.
     */
    config?: Record<string, any>;
    /**
     * IsEnabled - defaults true.
     */
    is_enabled?: boolean;
    /**
     * Layout is the freeform layout JSON object.
     */
    layout?: Record<string, any>;
    /**
     * OrderIndex controls the section ordering; defaults to 0.
     */
    order_index?: number;
    /**
     * Title is the optional section title (max 255).
     */
    title?: string;
    /**
     * Type is the section kind (e.g. `hero`, `featured_media`,
     * `tracklist`). Required.
     */
    type?: string;
    /**
     * Variant is the optional layout-variant name (max 50).
     */
    variant?: string;
    /**
     * Visibility - defaults to `public`.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

