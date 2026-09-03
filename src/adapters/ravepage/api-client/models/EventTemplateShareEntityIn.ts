/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventTemplateShareEntityIn = {
    /**
     * EntityID accepts BOTH bare UUID and `<prefix>_<uuid>` .
     */
    entity_id?: string;
    entity_type?: string;
    /**
     * Role defaults to "viewer" when empty/unset on the wire.
     */
    role?: string;
};

