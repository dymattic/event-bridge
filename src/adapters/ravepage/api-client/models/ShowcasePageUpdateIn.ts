/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShowcasePageUpdateIn = {
    /**
     * BioMD is the new Markdown bio.
     */
    bio_md?: string;
    /**
     * ClientID is the new FE-side correlation id.
     */
    client_id?: string;
    /**
     * CRM is the new CRM JSON object.
     */
    crm?: Record<string, any>;
    /**
     * DisplayName is the new title (1-255 chars).
     */
    display_name?: string;
    /**
     * IsPublished is the new publish flag.
     */
    is_published?: boolean;
    /**
     * OwnerID is the new owning-entity id (prefixed wire form matching
     * OwnerType - `usr_…`/`grp_…`/`perf_…`/`club_…` - or a bare UUID).
     * Set together with OwnerType to reassign ownership.
     */
    owner_id?: string;
    /**
     * OwnerType reassigns the page to a new owner kind. Optional - set
     * together with OwnerID to move ownership. Requires the caller manage
     * BOTH the current and the new owner (admin bypass). A namespace change
     * whose slug already exists in the target owner_type → 409.
     */
    owner_type?: 'user' | 'group' | 'performer' | 'club';
    /**
     * Theme is the new theme JSON object.
     */
    theme?: Record<string, any>;
    /**
     * Type is the new page kind.
     */
    type?: string;
    /**
     * Visibility is the new visibility.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

