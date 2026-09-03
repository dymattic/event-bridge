/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerTypeID } from './PerformerTypeID';
export type PerformerTypeOut = {
    /**
     * Description is the optional admin-supplied description.
     */
    description?: string;
    /**
     * ID is the canonical prefixed performer-type identifier.
     * Wire form: `ptyp_<uuid>`.
     */
    id?: PerformerTypeID;
    /**
     * Name is the human-readable role label, e.g. "Photographer".
     */
    name?: string;
    /**
     * Slug is the URL-safe slug, e.g. "photographer".
     */
    slug?: string;
};

