/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EPKID } from './EPKID';
import type { ProfileID } from './ProfileID';
import type { UserID } from './UserID';
export type EPKOut = {
    /**
     * BioOverride is the per-EPK bio override.
     */
    bio_override?: string;
    /**
     * Content is the rich content blob (see PublicEPKOut for the
     * canonical shape).
     */
    content?: Record<string, any>;
    /**
     * CreatedAt is the creation time.
     */
    created_at?: string;
    /**
     * ID is the EPK identifier (prefix `epk_`).
     */
    id?: EPKID;
    /**
     * IsPublic toggles visibility.
     */
    is_public?: boolean;
    /**
     * ProfileID is the parent profile reference.
     */
    profile_id?: ProfileID;
    /**
     * SelectedImageIDs is the curated gallery list.
     */
    selected_image_ids?: Array<string>;
    /**
     * Slug is the URL slug.
     */
    slug?: string;
    /**
     * ThemeOverride is the per-EPK theme override.
     */
    theme_override?: Record<string, any>;
    /**
     * Title is the public title.
     */
    title?: string;
    /**
     * UpdatedAt is the last-modified time.
     */
    updated_at?: string;
    /**
     * UserID is the owner user identifier.
     */
    user_id?: UserID;
};

