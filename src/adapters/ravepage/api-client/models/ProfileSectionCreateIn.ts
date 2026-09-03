/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileSectionCreateIn = {
    /**
     * ClientID is the optional client-app identifier.
     */
    client_id?: string;
    /**
     * Config is the free-form section configuration. Default empty
     * object.
     */
    config?: Array<number>;
    /**
     * IsEnabled toggles the section's active state. Default true.
     */
    is_enabled?: boolean;
    /**
     * Layout is the free-form layout configuration. Default empty
     * object.
     */
    layout?: Array<number>;
    /**
     * OrderIndex is the optional initial ordering index. Default 0.
     */
    order_index?: number;
    /**
     * Title is the optional display title.
     */
    title?: string;
    /**
     * Type is the free-form section type discriminator. Required.
     */
    type?: string;
    /**
     * Variant is the optional section variant.
     */
    variant?: string;
    /**
     * Visibility is the visibility scope. One of `public`, `unlisted`,
     * `private`. Default `public`.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

