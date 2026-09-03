/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LookupProfilePreviewBySlugOut = {
    /**
     * AvatarURL / BannerURL (OG-enrichment widening, 2026-07-16) are
     * absolute `/media/stream/{upload_id}` URLs synthesized producer-
     * side from the profile's media slots. "" when the slot is empty,
     * the upload isn't an image, or PROFILES_MEDIA_STREAM_BASE_URL is
     * unset.
     * Discover's composer prefers banner -> avatar -> synthetic card.
     */
    avatar_url?: string;
    banner_url?: string;
    /**
     * BioMD is the profile's bio_md column, possibly empty. Used as
     * PreviewDTO.description (truncated by the composer to 280 chars).
     */
    bio_md?: string;
    /**
     * CreatedAt is RFC3339 UTC. Used as PreviewDTO.published_at.
     */
    created_at?: string;
    /**
     * DisplayName is the profile's display_name column. Used as
     * PreviewDTO.title.
     */
    display_name?: string;
    /**
     * IsPublished is the profile's is_published column.
     */
    is_published?: boolean;
    /**
     * OwnerType is one of "user", "performer", "group", "club".
     * Discover-side v1 composer promotes only "user" to a live
     * PreviewDTO; the other three return 422 OWNER_TYPE_NOT_YET_PORTED.
     */
    owner_type?: string;
    /**
     * ProfileID is the bare-UUID string of the matched profiles row.
     */
    profile_id?: string;
    /**
     * Slug echoes the request's path param so the discover-side
     * composer can correlate when multiple in-flight calls share a
     * connection.
     */
    slug?: string;
    /**
     * UpdatedAt is RFC3339 UTC. Used as PreviewDTO.modified_at and
     * feeds into PreviewDTO.cache_key version computation.
     */
    updated_at?: string;
    /**
     * Visibility is the profile's visibility column ("public" /
     * "unlisted" / "private"). The producer never returns rows that
     * would fail the visibility filter - this field is echoed for
     * observability and for forward-compat where the discover-side
     * composer may want to set different cache headers per visibility.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

