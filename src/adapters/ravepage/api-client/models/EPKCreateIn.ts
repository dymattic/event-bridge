/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileID } from './ProfileID';
export type EPKCreateIn = {
    /**
     * BioOverride replaces the profile's default bio for this EPK.
     */
    bio_override?: string;
    /**
     * IsPublic toggles visibility. Defaults true on the wire.
     */
    is_public?: boolean;
    /**
     * ProfileID is the profile this EPK is attached to (prefix `pro_`).
     */
    profile_id?: ProfileID;
    /**
     * SelectedImageIDs is the ordered list of PromotionImage UUIDs
     * (bare-UUID strings) to feature in the EPK gallery.
     */
    selected_image_ids?: Array<string>;
    /**
     * Slug is the URL slug used in `/epk/{slug}` (1-255 chars; unique).
     */
    slug?: string;
    /**
     * ThemeOverride is the freeform theme JSON blob.
     */
    theme_override?: Record<string, any>;
    /**
     * Title is the public title shown on the EPK page (1-255 chars).
     */
    title?: string;
};

