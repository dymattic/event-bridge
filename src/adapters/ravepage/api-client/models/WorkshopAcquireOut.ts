/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkshopAcquireOut = {
    /**
     * Acquired is true when the item is (now) in the caller's library.
     */
    acquired?: boolean;
    /**
     * AcquiredAt is the library-add timestamp.
     */
    acquired_at?: string;
    /**
     * Entitled is true when the caller holds an entitlement.
     */
    entitled?: boolean;
    /**
     * ItemID is the acquired item's prefixed id.
     */
    item_id?: string;
    /**
     * ItemKind is the acquired item's kind.
     */
    item_kind?: string;
};

