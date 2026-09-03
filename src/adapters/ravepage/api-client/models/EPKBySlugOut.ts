/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EPKBySlugImages } from './EPKBySlugImages';
import type { EPKBySlugProfile } from './EPKBySlugProfile';
export type EPKBySlugOut = {
    /**
     * Contacts is the contact-info map extracted from CRM.
     */
    contacts?: Record<string, string>;
    /**
     * CRM is the raw profile CRM blob.
     */
    crm?: Record<string, any>;
    /**
     * EPKID is set when a dedicated EPK row resolved the slug.
     */
    epk_id?: string;
    /**
     * EPKSlug is set when a dedicated EPK row resolved the slug.
     */
    epk_slug?: string;
    /**
     * Images are the grouped image references.
     */
    images?: EPKBySlugImages;
    /**
     * Profile is the embedded profile projection.
     */
    profile?: EPKBySlugProfile;
    /**
     * Socials is the social-platform link map extracted from CRM.
     */
    socials?: Record<string, string>;
    /**
     * Theme is the EPK theme override (or profile theme fallback).
     */
    theme?: Record<string, any>;
    /**
     * Title is the EPK title (or profile display_name fallback).
     */
    title?: string;
};

