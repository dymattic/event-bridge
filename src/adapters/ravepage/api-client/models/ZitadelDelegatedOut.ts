/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ZitadelDelegatedDetails } from './ZitadelDelegatedDetails';
export type ZitadelDelegatedOut = {
    /**
     * Details carries the stable error code + the bootstrap endpoint.
     */
    details?: ZitadelDelegatedDetails;
    /**
     * Message is a human-readable migration pointer.
     */
    message?: string;
    /**
     * Status is always "error" for the 410 body.
     */
    status?: 'error';
};

