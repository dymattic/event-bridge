/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShareGrantOut } from './ShareGrantOut';
export type ShareGrantListOut = {
    /**
     * Count of rows returned.
     */
    count?: number;
    /**
     * Shares for the entity (or targeting the caller, /shares/incoming).
     */
    shares?: Array<ShareGrantOut>;
};

