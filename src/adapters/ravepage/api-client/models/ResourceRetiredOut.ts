/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResourceRetiredDetails } from './ResourceRetiredDetails';
export type ResourceRetiredOut = {
    /**
     * Details carries the stable error code + the new endpoint.
     */
    details?: ResourceRetiredDetails;
    /**
     * Message is the human-readable migration pointer.
     */
    message?: string;
    /**
     * Status is always "error" for the 410 body.
     */
    status?: 'error';
};

