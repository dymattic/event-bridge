/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MediaCollectionItemOut = {
    /**
     * CollectionID is the prefixed wire form "mco_<uuid>".
     */
    collection_id?: string;
    created_at?: string;
    /**
     * ID is the prefixed wire form "mci_<uuid>".
     */
    id?: string;
    /**
     * Label is nullable - `*string` so absent wire-emits `null`.
     */
    label?: string;
    /**
     * MediaUploadID is the prefixed wire form "upl_<uuid>".
     */
    media_upload_id?: string;
    sort_order?: number;
};

