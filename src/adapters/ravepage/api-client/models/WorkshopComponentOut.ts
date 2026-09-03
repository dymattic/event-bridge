/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkshopComponentOut = {
    /**
     * AuthorID is the prefixed uploader user id.
     */
    author_id?: string;
    /**
     * Category is the optional category slug.
     */
    category?: string;
    /**
     * ComponentType is `css` or `css-js`.
     */
    component_type?: 'css' | 'css-js';
    /**
     * ContentHash is the deterministic render-data hash for dedup.
     */
    content_hash?: string;
    /**
     * CreatedAt is the creation timestamp.
     */
    created_at?: string;
    /**
     * DefaultParams is the default values for the param schema.
     */
    default_params?: Array<number>;
    /**
     * Description is the optional long-form blurb.
     */
    description?: string;
    /**
     * ForkCount is the lifetime fork tally.
     */
    fork_count?: number;
    /**
     * ForkedFromID is the source component id when this row is a fork.
     */
    forked_from_id?: string;
    /**
     * ID is the prefixed component id.
     */
    id?: string;
    /**
     * InstallCount is the lifetime install tally.
     */
    install_count?: number;
    /**
     * IsFeatured flags curated picks.
     */
    is_featured?: boolean;
    /**
     * IsPublished governs marketplace visibility.
     */
    is_published?: boolean;
    /**
     * LikeCount is the lifetime like tally.
     */
    like_count?: number;
    /**
     * ParamSchema is the JSON Schema describing tunable params.
     */
    param_schema?: Array<number>;
    /**
     * PreviewVideoUploadID is the optional preview video media id.
     */
    preview_video_upload_id?: string;
    /**
     * PriceAmount is the optional fixed-price or suggested donation.
     */
    price_amount?: number;
    /**
     * PriceType is one of `free`, `premium`, `donation`.
     */
    price_type?: 'free' | 'premium' | 'donation';
    /**
     * RatingAvg is the mean rating (1..5) or null when unrated.
     */
    rating_avg?: number;
    /**
     * RatingCount is the number of ratings.
     */
    rating_count?: number;
    /**
     * RenderData is the rendering payload (css / js / html).
     */
    render_data?: Array<number>;
    /**
     * Slug is the URL-friendly unique name.
     */
    slug?: string;
    /**
     * Tags is the freeform tag list.
     */
    tags?: Array<string>;
    /**
     * ThumbnailUploadID is the optional thumbnail media id.
     */
    thumbnail_upload_id?: string;
    /**
     * Title is the human-readable name.
     */
    title?: string;
    /**
     * UpdatedAt is the last-update timestamp.
     */
    updated_at?: string;
};

