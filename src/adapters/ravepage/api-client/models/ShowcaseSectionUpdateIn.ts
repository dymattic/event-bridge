/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShowcaseSectionUpdateIn = {
    /**
     * ClientID is the new FE-side correlation id.
     */
    client_id?: string;
    /**
     * Config is the new section-config JSON object.
     */
    config?: Record<string, any>;
    /**
     * IsEnabled is the new render flag.
     */
    is_enabled?: boolean;
    /**
     * Layout is the new layout JSON object.
     */
    layout?: Record<string, any>;
    /**
     * OrderIndex is the new ordering position.
     */
    order_index?: number;
    /**
     * Title is the new section title.
     */
    title?: string;
    /**
     * Type is the new section kind.
     */
    type?: string;
    /**
     * Variant is the new layout variant.
     */
    variant?: string;
    /**
     * Visibility is the new visibility.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

