/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileMediaCreateIn = {
    /**
     * DisplayOrder is the render order within the slot.
     */
    display_order?: number;
    /**
     * MediaUploadID is the underlying upload row id. Required. Wire
     * form accepts `upl_<uuid>` or bare UUID; the handler decodes
     * into the raw string to support both.
     */
    media_upload_id?: string;
    /**
     * Slot is the media slot category. Required. One of `avatar`,
     * `banner`, `logo`.
     */
    slot?: string;
    /**
     * Variant is the optional kind tag for logos. Avatars/banners
     * ignore this field .
     */
    variant?: string;
};

