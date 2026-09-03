/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerTypeID } from './PerformerTypeID';
export type MyPerformerCreateIn = {
    /**
     * Bio is the optional short biography.
     */
    bio?: string;
    /**
     * ImageURL is the optional profile image URL.
     */
    image_url?: string;
    /**
     * Name is the public / professional name. Required, 1-255 chars.
     */
    name?: string;
    /**
     * PerformerTypeID is the optional role-type reference (prefix
     * `ptyp_<uuid>`). When supplied, the row must exist or the
     * endpoint 404s.
     */
    performer_type_id?: PerformerTypeID;
};

