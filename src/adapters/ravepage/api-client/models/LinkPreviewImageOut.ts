/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LinkPreviewImageOut = {
    /**
     * Alt text as declared by the page, empty when absent.
     */
    alt?: string;
    /**
     * Height in pixels as declared by the page, 0 when unknown.
     */
    height?: number;
    /**
     * ProxyURL is the image, served from our origin. Render this.
     */
    proxy_url?: string;
    /**
     * SourceHost is the hostname the image came from, for a "via
     * example.com" label. Not fetchable as-is, by design.
     */
    source_host?: string;
    /**
     * Width in pixels as declared by the page, 0 when unknown.
     */
    width?: number;
};

