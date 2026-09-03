/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileTemplateOut = {
    id?: string;
    /**
     * IsPublic - true when the template is admin-published.
     */
    is_public?: boolean;
    /**
     * Name is the human-readable template name.
     */
    name?: string;
    /**
     * OwnerUserID is the creating user's bare UUID. Null for system-public
     * templates (e.g. the DyMattic seed at id 00...D001).
     */
    owner_user_id?: string;
    /**
     * Sections is the ordered array of section blueprints. sections["sections"]` from JSON storage; the Go port mirrors.
     */
    sections?: Array<Array<number>>;
    /**
     * Type is the profile type the template targets. One of `artist`,
     * `club`, `group`, `label`, `venue`, `event_series`, `other`.
     */
    type?: string;
};

