/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileLinkCreateIn = {
    /**
     * DisplayOrder is the render order.
     */
    display_order?: number;
    /**
     * Label is the optional display label.
     */
    label?: string;
    /**
     * LinkType is the typed link category. Required. See ProfileLinkItem
     * for the whitelist.
     */
    link_type?: string;
    /**
     * URL is the destination URL. Required.
     */
    url?: string;
};

