/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtistNameID } from './ArtistNameID';
import type { UserID } from './UserID';
export type ArtistNameOut = {
    /**
     * Bio is the optional freeform bio.
     */
    bio?: string;
    /**
     * CreatedAt is the row creation timestamp.
     */
    created_at?: string;
    /**
     * ID is the prefixed artist-name identifier (`arn_<uuid>`).
     */
    id?: ArtistNameID;
    /**
     * IsPrimary flags the user's primary stage name.
     */
    is_primary?: boolean;
    /**
     * Name is the artist / stage name.
     */
    name?: string;
    /**
     * UserID is the owning user (`usr_<uuid>`).
     */
    user_id?: UserID;
};

