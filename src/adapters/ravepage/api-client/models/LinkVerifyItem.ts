/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LinkVerifyItem = {
    /**
     * Platform - LinkVerifyPlatformYouTube or LinkVerifyPlatformSoundCloud.
     * Any other value yields Checked=false (unsupported).
     */
    platform?: string;
    /**
     * Ref - opaque caller correlation key echoed back on every result
     * (tracks passes the candidate id). Never interpreted.
     */
    ref?: string;
    /**
     * URL - the discovered-link URL to verify (the platform id is parsed
     * from it producer-side).
     */
    url?: string;
};

