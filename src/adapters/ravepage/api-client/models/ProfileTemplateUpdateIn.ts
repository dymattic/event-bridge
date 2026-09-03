/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileTemplateUpdateIn = {
    /**
     * IsPublic - optional. Admin-only when present and true .
     */
    is_public?: boolean;
    /**
     * Name - optional replacement name. Sanitized when present.
     */
    name?: string;
    /**
     * Sections - optional replacement sections array.
     */
    sections?: Array<Array<number>>;
};

