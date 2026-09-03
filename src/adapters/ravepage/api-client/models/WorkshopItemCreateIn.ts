/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkshopItemCreateIn = {
    /**
     * Category is the optional category slug.
     */
    category?: string;
    /**
     * ComponentType is `css` / `css-js` (component kind only).
     */
    component_type?: 'css' | 'css-js';
    /**
     * Definition is the kind-specific payload.
     */
    definition?: Record<string, any>;
    /**
     * Description is the optional long-form blurb.
     */
    description?: string;
    /**
     * IsPublished governs marketplace visibility (default false).
     */
    is_published?: boolean;
    /**
     * Kind is the polymorphic discriminator (`preset`, `component`, …).
     */
    kind?: string;
    /**
     * PreviewURL is the optional CDN preview URL.
     */
    preview_url?: string;
    /**
     * PreviewVideoUploadID is optional `upl_<uuid>`.
     */
    preview_video_upload_id?: string;
    /**
     * PriceAmount is the optional fixed price.
     */
    price_amount?: number;
    /**
     * PriceType is `free` / `premium` / `donation` (default `free`).
     */
    price_type?: 'free' | 'premium' | 'donation';
    /**
     * Slug is the URL-friendly name (unique per kind). Optional - a slug
     * is derived from the title when omitted.
     */
    slug?: string;
    /**
     * Tags is the freeform tag list.
     */
    tags?: Array<string>;
    /**
     * ThumbnailUploadID is optional `upl_<uuid>` (bare UUID accepted).
     */
    thumbnail_upload_id?: string;
    /**
     * Title is the human-readable name. 1..255.
     */
    title?: string;
};

