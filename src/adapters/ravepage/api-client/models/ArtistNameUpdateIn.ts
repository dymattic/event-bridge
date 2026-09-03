/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ArtistNameUpdateIn = {
    /**
     * Bio is the new freeform bio.
     */
    bio?: string;
    /**
     * IsPrimary toggles the primary-stage-name flag. When set true,
     * any existing primary owned by the same user is demoted.
     */
    is_primary?: boolean;
    /**
     * Name is the new artist / stage name (1-255 chars).
     */
    name?: string;
};

