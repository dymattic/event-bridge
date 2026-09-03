/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DJSetRetiredDetails } from './DJSetRetiredDetails';
export type DJSetRetiredOut = {
    /**
     * Details carries the stable error code + the new endpoint.
     */
    details?: DJSetRetiredDetails;
    /**
     * Message is the human-readable migration pointer.
     */
    message?: string;
    /**
     * Status is always "error" for the 410 body.
     */
    status?: 'error';
};

