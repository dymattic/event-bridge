/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LinkSuppressionIn = {
    /**
     * Platform is the platform key of the link (echoed from
     * platform_links). Advisory - the URL is the identity key.
     */
    platform?: string;
    /**
     * URL is the exact discovered-link URL to suppress. REQUIRED.
     */
    url?: string;
};

