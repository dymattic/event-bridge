/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EPKUpdateIn = {
    /**
     * BioOverride replaces the bio override.
     */
    bio_override?: string;
    /**
     * Content replaces the rich EPK content (hero, sections, etc.).
     */
    content?: Record<string, any>;
    /**
     * IsPublic toggles public visibility.
     */
    is_public?: boolean;
    /**
     * SelectedImageIDs replaces the gallery image list.
     */
    selected_image_ids?: Array<string>;
    /**
     * Slug replaces the slug (must remain unique).
     */
    slug?: string;
    /**
     * ThemeOverride replaces the theme override JSON blob.
     */
    theme_override?: Record<string, any>;
    /**
     * Title replaces the title. Omit to leave unchanged.
     */
    title?: string;
};

