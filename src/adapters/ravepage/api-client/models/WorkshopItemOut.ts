/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkshopAuthorSummary } from './WorkshopAuthorSummary';
export type WorkshopItemOut = {
    /**
     * Author is the compact uploader projection.
     */
    author?: WorkshopAuthorSummary;
    /**
     * AuthorID is the prefixed uploader user id (`usr_<uuid>`).
     */
    author_id?: string;
    /**
     * Category is the optional category slug.
     */
    category?: string;
    /**
     * ComponentType is `css` / `css-js` on component-kind items.
     */
    component_type?: 'css' | 'css-js';
    /**
     * ContentHash is the deterministic definition hash (component kind).
     */
    content_hash?: string;
    /**
     * CreatedAt is the creation timestamp.
     */
    created_at?: string;
    /**
     * Definition is the kind-specific payload. Null/omitted for a paid
     * item the caller lacks an entitlement for (metadata-only view).
     */
    definition?: Record<string, any>;
    /**
     * Description is the optional long-form blurb.
     */
    description?: string;
    /**
     * ForkCount is the lifetime fork tally.
     */
    fork_count?: number;
    /**
     * ForkedFromID is the source item id when this row is a fork.
     */
    forked_from_id?: string;
    /**
     * HasEntitlement is true when the caller may access the raw
     * definition (free item, owner, admin, or granted entitlement).
     */
    has_entitlement?: boolean;
    /**
     * ID is the prefixed item id (`wsi_<uuid>`).
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
     * Kind is the polymorphic discriminator (`preset`, `component`, …).
     */
    kind?: string;
    /**
     * LikeCount is the lifetime like tally.
     */
    like_count?: number;
    /**
     * PreviewURL is the optional CDN preview URL.
     */
    preview_url?: string;
    /**
     * PreviewVideoUploadID is the optional preview video media id.
     */
    preview_video_upload_id?: string;
    /**
     * PriceAmount is the optional fixed price / suggested donation.
     */
    price_amount?: number;
    /**
     * PriceType is `free` / `premium` / `donation`.
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
     * Slug is the URL-friendly name (unique per kind).
     */
    slug?: string;
    /**
     * Tags is the freeform tag list.
     */
    tags?: Array<string>;
    /**
     * ThumbnailUploadID is the optional thumbnail media id (`upl_<uuid>`).
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

