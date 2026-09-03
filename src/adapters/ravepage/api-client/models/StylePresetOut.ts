/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StylePresetOut = {
    /**
     * AuthorID is the prefixed uploader user id.
     */
    author_id?: string;
    /**
     * Category is the optional category slug.
     */
    category?: string;
    /**
     * CreatedAt is the creation timestamp.
     */
    created_at?: string;
    /**
     * Description is the optional long-form blurb.
     */
    description?: string;
    /**
     * ID is the prefixed preset id (`wkp_<uuid>`).
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
     * PreviewURL is the optional CDN preview URL.
     */
    preview_url?: string;
    /**
     * PriceAmount is the optional fixed price.
     */
    price_amount?: number;
    /**
     * PriceType is `free` / `premium` / `donation`.
     */
    price_type?: 'free' | 'premium' | 'donation';
    /**
     * RatingAvg is the mean rating or null when unrated.
     */
    rating_avg?: number;
    /**
     * RatingCount is the number of ratings.
     */
    rating_count?: number;
    /**
     * SectionStyles is the list of per-section style entries.
     */
    section_styles?: Array<Record<string, any>>;
    /**
     * Slug is the URL-friendly unique name.
     */
    slug?: string;
    /**
     * Tags is the freeform tag list.
     */
    tags?: Array<string>;
    /**
     * Theme is the theme payload (colors / typography / etc).
     */
    theme?: Record<string, any>;
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

