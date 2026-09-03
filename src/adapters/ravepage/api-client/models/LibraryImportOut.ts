/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LibraryImportResultOut } from './LibraryImportResultOut';
export type LibraryImportOut = {
    /**
     * Format detected/used for the import.
     */
    format?: string;
    /**
     * Imported is the count of rows upserted (parsed + dedup-merged).
     */
    imported?: number;
    /**
     * Matched is the count of rows that auto-linked to a canonical track.
     */
    matched?: number;
    /**
     * Parsed is the count of rows the parser recognised in the file.
     */
    parsed?: number;
    /**
     * Results is the per-row outcome list.
     */
    results?: Array<LibraryImportResultOut>;
};

