/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EPKArtist } from './EPKArtist';
import type { EPKAssets } from './EPKAssets';
import type { EPKBooking } from './EPKBooking';
import type { EPKContent } from './EPKContent';
import type { EPKMedia } from './EPKMedia';
import type { EPKPress } from './EPKPress';
import type { EPKSEO } from './EPKSEO';
export type PublicEPKOut = {
    /**
     * Artist is artist-level metadata.
     */
    artist?: EPKArtist;
    /**
     * Assets are downloadable press photos / logos / PDF.
     */
    assets?: EPKAssets;
    /**
     * Booking is contact + social links.
     */
    booking?: EPKBooking;
    /**
     * Content is the body (hero + sections).
     */
    content?: EPKContent;
    /**
     * LastUpdated is the EPK / profile last-modified time.
     */
    last_updated?: string;
    /**
     * Media is featured listen/watch.
     */
    media?: EPKMedia;
    /**
     * Press is press copy (bios, highlights, values).
     */
    press?: EPKPress;
    /**
     * SEO is metadata for the public page.
     */
    seo?: EPKSEO;
    /**
     * Version is the contract version. Always "1.0" for now.
     */
    version?: string;
};

