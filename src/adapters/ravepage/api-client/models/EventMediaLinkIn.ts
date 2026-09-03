/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventMediaLinkIn = {
    /**
     * Caption - optional human caption.
     */
    caption?: string;
    /**
     * MediaUploadID - bare UUID or `upl_<uuid>` prefixed form.
     */
    media_upload_id?: string;
    /**
     * Role - one of gallery|teaser|aftermovie|backstage|poster|
     * thumbnail. Defaults to "gallery" when empty .
     */
    role?: string;
    /**
     * SortOrder - display order; defaults to 0.
     */
    sort_order?: number;
};

