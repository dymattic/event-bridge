/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaUploadID } from './MediaUploadID';
export type ShowcasePageCreateIn = {
    /**
     * BackgroundMediaUploadID is the optional background media ref
     * (`upl_<uuid>`). v1 ignored at create; set later via
     * PATCH `/showcase/pages/{page_id}/background`.
     */
    background_media_upload_id?: MediaUploadID;
    /**
     * BioMD is the optional Markdown bio.
     */
    bio_md?: string;
    /**
     * ClientID is the optional FE-side correlation id.
     */
    client_id?: string;
    /**
     * CRM is the freeform CRM JSON object.
     */
    crm?: Record<string, any>;
    /**
     * DisplayName is the human-readable page title. 1-255 chars.
     */
    display_name?: string;
    /**
     * IsPublished - defaults true.
     */
    is_published?: boolean;
    /**
     * OwnerID is the owning-entity id. Accepts the prefixed wire
     * form matching OwnerType (`usr_…` / `grp_…` / `perf_…` /
     * `club_…`) or a bare UUID. Defaults to the authenticated
     * user when OwnerType is `user`.
     */
    owner_id?: string;
    /**
     * OwnerType is the owning-entity kind. Defaults to `user`.
     */
    owner_type?: 'user' | 'group' | 'performer' | 'club';
    /**
     * Slug is the unique page slug. Required.
     */
    slug?: string;
    /**
     * Theme is the freeform theme JSON object.
     */
    theme?: Record<string, any>;
    /**
     * Type is the page kind.
     */
    type?: 'artist' | 'club' | 'group' | 'label' | 'venue' | 'event_series' | 'other';
    /**
     * Visibility - defaults to `public`.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

