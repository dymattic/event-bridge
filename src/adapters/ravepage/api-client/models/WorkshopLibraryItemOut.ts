/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkshopItemOut } from './WorkshopItemOut';
export type WorkshopLibraryItemOut = {
    /**
     * AcquiredAt is the library-add timestamp.
     */
    acquired_at?: string;
    /**
     * AcquiredFromSlug is the slug the item was acquired under.
     */
    acquired_from_slug?: string;
    /**
     * Item is the acquired item.
     */
    item?: WorkshopItemOut;
};

