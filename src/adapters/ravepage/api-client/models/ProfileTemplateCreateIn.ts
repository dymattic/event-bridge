/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileTemplateCreateIn = {
    /**
     * IsPublic - admin-only. silently coerces to false for
     * non-admins (
         */
        is_public?: boolean;
        /**
         * Name - required. Sanitized via tag-strip at the service layer.
         */
        name?: string;
        /**
         * Sections - required. Forwarded as-given into JSON storage.
         */
        sections?: Array<Array<number>>;
        /**
         * Type - required. Profile-type whitelist enforced at the boundary.
         */
        type?: string;
    };

