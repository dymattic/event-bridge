/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestoreProfileSnapshotIn = {
    /**
     * BioMD - nil to leave unchanged. Markdown bio.
     */
    bio_md?: string;
    caller_is_admin?: boolean;
    /**
     * CallerUserID - bare UUID of the user invoking the restore.
     * Producer uses this as the editor-membership BOLA check .
     */
    caller_user_id?: string;
    /**
     * CRM - nil to leave unchanged. JSON object literal; producer
     * re-validates.
     */
    crm?: Record<string, any>;
    /**
     * DisplayName - nil to leave unchanged.
     */
    display_name?: string;
    /**
     * IsPublished - nil to leave unchanged.
     */
    is_published?: boolean;
    /**
     * Theme - nil to leave unchanged. JSON object literal; producer
     * re-validates as valid JSON.
     */
    theme?: Record<string, any>;
    /**
     * Type - nil to leave unchanged. Profile type enum (DJ /
     * performer / etc.). Producer re-validates against the
     * profile-types catalog.
     */
    type?: string;
    /**
     * Visibility - nil to leave unchanged. One of {public, unlisted,
     * private}.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

