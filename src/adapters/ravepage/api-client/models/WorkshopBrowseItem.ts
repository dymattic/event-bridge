/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkshopAuthorSummary } from './WorkshopAuthorSummary';
export type WorkshopBrowseItem = {
    /**
     * Author is the compact uploader projection.
     */
    author?: WorkshopAuthorSummary;
    /**
     * Category is the optional category slug.
     */
    category?: string;
    /**
     * ComponentType is set on component rows only - `css` / `css-js`.
     */
    component_type?: 'css' | 'css-js';
    /**
     * CreatedAt is the creation timestamp.
     */
    created_at?: string;
    /**
     * Description is the optional long-form blurb.
     */
    description?: string;
    /**
     * ForkCount is set on component rows only.
     */
    fork_count?: number;
    /**
     * ID is the polymorphic item UUID (raw - discriminator picks the
     * prefix).
     */
    id?: string;
    /**
     * InstallCount is the lifetime install tally.
     */
    install_count?: number;
    /**
     * ItemType discriminates preset vs component.
     */
    item_type?: 'preset' | 'component';
    /**
     * LikeCount is the lifetime like tally.
     */
    like_count?: number;
    /**
     * PriceType is one of `free`, `premium`, `donation`.
     */
    price_type?: 'free' | 'premium' | 'donation';
    /**
     * RatingAvg is the mean rating (1..5) or null when unrated.
     */
    rating_avg?: number;
    /**
     * Slug is the URL-friendly unique name.
     */
    slug?: string;
    /**
     * Tags is the freeform tag list.
     */
    tags?: Array<string>;
    /**
     * ThumbnailUploadID is the optional thumbnail media id
     * (`upl_<uuid>`).
     */
    thumbnail_upload_id?: string;
    /**
     * Title is the human-readable name.
     */
    title?: string;
};

