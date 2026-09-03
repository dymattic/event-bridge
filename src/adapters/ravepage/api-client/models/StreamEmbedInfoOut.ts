/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StreamEmbedInfoOut = {
    /**
     * CustomerCode is the legacy `customer-<code>.cloudflarestream.com`
     * short code.
     */
    customer_code?: string;
    /**
     * DASHURL is the DASH manifest URL for custom players.
     */
    dash_url?: string;
    /**
     * HLSURL is the HLS manifest URL for custom players.
     */
    hls_url?: string;
    /**
     * IframeURL is the embeddable iframe `src` URL. Non-null.
     */
    iframe_url?: string;
    /**
     * IsLive flags whether this is a live input embed vs a VOD embed. The schema bit stays parity-faithful
     * so the sibling live-input embed cycle can reuse the DTO.
     */
    is_live?: boolean;
    /**
     * VideoUID is the Cloudflare video / live-input UID. Non-null.
     */
    video_uid?: string;
};

