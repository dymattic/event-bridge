/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerTypeID } from './PerformerTypeID';
export type PerformerCreateIn = {
    /**
     * Bio is the optional freeform bio.
     */
    bio?: string;
    /**
     * ImageURL is the optional legacy plain-URL image field.
     */
    image_url?: string;
    /**
     * Name is the public / professional name. Required, 1-255 chars.
     */
    name?: string;
    /**
     * PerformerTypeID is the optional role-type reference (prefix
     * `ptyp_<uuid>`).
     */
    performer_type_id?: PerformerTypeID;
};

