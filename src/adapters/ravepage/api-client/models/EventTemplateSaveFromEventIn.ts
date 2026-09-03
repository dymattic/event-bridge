/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventTemplateSaveFromEventIn = {
    /**
     * Description is free-form notes for the owner.
     */
    description?: string;
    /**
     * Name is the owner-facing template name. Required.
     */
    name?: string;
    /**
     * Visibility defaults to "private" when unset; one of
     * {private, shared, public}.
     */
    visibility?: 'private' | 'shared' | 'public';
};

