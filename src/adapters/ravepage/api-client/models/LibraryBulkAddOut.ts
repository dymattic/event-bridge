/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LibraryBulkResultOut } from './LibraryBulkResultOut';
import type { LibraryBulkSummaryOut } from './LibraryBulkSummaryOut';
export type LibraryBulkAddOut = {
    /**
     * Results, one per request item, in request order.
     */
    results?: Array<LibraryBulkResultOut>;
    /**
     * Summary counts.
     */
    summary?: LibraryBulkSummaryOut;
};

