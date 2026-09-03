/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileMediaUpdateIn = {
    /**
     * DisplayOrder - optional new render order.
     */
    display_order?: number;
    /**
     * MediaUploadID - optional replacement upload. Accepts
     * `upl_<uuid>` or bare UUID.
     */
    media_upload_id?: string;
    /**
     * Variant - optional replacement variant tag.
     */
    variant?: string;
};

