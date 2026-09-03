/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerTypeID } from './PerformerTypeID';
export type PerformerUpdateIn = {
    /**
     * Bio is the new freeform bio.
     */
    bio?: string;
    /**
     * ImageURL is the new legacy plain-URL image field.
     */
    image_url?: string;
    /**
     * Name is the new public / professional name (max 255).
     */
    name?: string;
    /**
     * PerformerTypeID is the new role-type reference.
     */
    performer_type_id?: PerformerTypeID;
};

