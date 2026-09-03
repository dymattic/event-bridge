/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LibraryBulkDeleteIn = {
    /**
     * All deletes the caller's ENTIRE library. Mutually exclusive
     * with `ids`.
     */
    all?: boolean;
    /**
     * IDs are the prefixed library-row ids (`lib_<uuid>`, 1-500).
     * Mutually exclusive with `all`.
     */
    ids?: Array<string>;
};

