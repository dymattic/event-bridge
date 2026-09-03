/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ArtistNameCreateIn = {
    /**
     * Bio is the optional freeform bio.
     */
    bio?: string;
    /**
     * IsPrimary marks this as the user's primary stage name; any
     * existing primary is demoted within the same transaction.
     */
    is_primary?: boolean;
    /**
     * Name is the artist / stage name. Required, 1-255 chars.
     */
    name?: string;
};

