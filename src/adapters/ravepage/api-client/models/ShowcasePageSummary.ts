/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShowcasePageSummary = {
    background_media_kind?: string;
    background_media_upload_id?: string;
    bio_md?: string;
    canonical_path?: string;
    client_id?: string;
    crm?: Array<number>;
    display_name?: string;
    id?: string;
    is_published?: boolean;
    owner_id?: string;
    owner_type?: string;
    owner_user_username?: string;
    /**
     * stable base62 permalink key (/showcase/c/{short_code})
     */
    short_code?: string;
    slug?: string;
    theme?: Array<number>;
    type?: string;
    visibility?: 'public' | 'unlisted' | 'private';
};

