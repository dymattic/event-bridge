/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerID } from './PerformerID';
export type PerformerShowcaseSummaryOut = {
    /**
     * DisplayName mirrors `showcase_pages.display_name`.
     */
    display_name?: string;
    /**
     * IsPublished mirrors `showcase_pages.is_published`.
     */
    is_published?: boolean;
    /**
     * OwnerUserUsername is the claiming user's username (nil when the
     * performer is unclaimed).
     */
    owner_user_username?: string;
    /**
     * PerformerID is the performer's prefixed id.
     */
    performer_id?: PerformerID;
    /**
     * ShowcasePageID is the linked showcase page's bare UUID `; matched verbatim).
     */
    showcase_page_id?: string;
    /**
     * ShowcaseSlug is the showcase page slug.
     */
    showcase_slug?: string;
    /**
     * Type mirrors `showcase_pages.type`.
     */
    type?: string;
    /**
     * Visibility mirrors `showcase_pages.visibility`.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

