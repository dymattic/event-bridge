/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkshopComponentCreateIn = {
    /**
     * Category is optional category slug.
     */
    category?: string;
    /**
     * ComponentType is `css` or `css-js`.
     */
    component_type?: 'css' | 'css-js';
    /**
     * DefaultParams holds default values for the param schema.
     */
    default_params?: Record<string, any>;
    /**
     * Description is optional long-form blurb.
     */
    description?: string;
    /**
     * IsPublished governs marketplace visibility (default false).
     */
    is_published?: boolean;
    /**
     * ParamSchema describes tunable params (JSON Schema fragment).
     */
    param_schema?: Record<string, any>;
    /**
     * PreviewVideoUploadID is optional `upl_<uuid>`.
     */
    preview_video_upload_id?: string;
    /**
     * PriceAmount is optional fixed price.
     */
    price_amount?: number;
    /**
     * PriceType is `free` / `premium` / `donation` (default `free`).
     */
    price_type?: 'free' | 'premium' | 'donation';
    /**
     * RenderData is the render payload `{css, js?, html?}`.
     */
    render_data?: Record<string, any>;
    /**
     * Slug is URL-friendly unique name. 1..255.
     */
    slug?: string;
    /**
     * Tags is freeform tag list.
     */
    tags?: Array<string>;
    /**
     * ThumbnailUploadID is optional `upl_<uuid>` (bare UUID accepted).
     */
    thumbnail_upload_id?: string;
    /**
     * Title is human-readable name. 1..255.
     */
    title?: string;
};

