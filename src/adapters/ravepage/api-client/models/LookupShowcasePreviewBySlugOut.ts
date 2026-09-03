/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LookupShowcasePreviewBySlugOut = {
    /**
     * CanonicalPath is the FE path ("/showcase/{slug}").
     */
    canonical_path?: string;
    created_at?: string;
    /**
     * Description is the page bio_md ("" when null). Composer
     * truncates to the 280-char preview budget.
     */
    description?: string;
    /**
     * "" when the page
     * has no crawler-usable image.
     */
    image_url?: string;
    /**
     * OwnerName is the owning user's username for owner_type=user (""
     * for other owner types in v1 - performer/group/club display-name
     * resolution is a documented follow-up; fail-soft).
     */
    owner_name?: string;
    /**
     * PageID is the bare-UUID string of the matched showcase_pages row.
     */
    page_id?: string;
    /**
     * Slug is the resolved global slug (canonicalization source).
     */
    slug?: string;
    /**
     * Title is the page display_name.
     */
    title?: string;
    updated_at?: string;
};

