/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LibraryBulkSummaryOut = {
    /**
     * Created rows (fresh inserts).
     */
    created?: number;
    /**
     * Failed rows (status=error).
     */
    failed?: number;
    /**
     * Matched rows that resolved a canonical track this call.
     */
    matched?: number;
    /**
     * Received is the request's track count.
     */
    received?: number;
    /**
     * Updated rows (dedup hits, refreshed in place).
     */
    updated?: number;
};

