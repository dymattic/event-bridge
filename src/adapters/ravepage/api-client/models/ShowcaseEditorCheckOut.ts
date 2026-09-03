/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShowcaseEditorCheckOut = {
    /**
     * IsEditor - true when the caller resolves to owner OR editor
     * role. False for viewer / none / page_not_found /
     * owner_type_pending.
     */
    is_editor?: boolean;
    /**
     * OwnerType - the page's `owner_type` (`user` / `performer` /
     * `group` / `club` / `label`). Empty when Reason=page_not_found.
     * Useful for callers that need to gate the owner-only verbs
     * (e.g., delete) on the resolved role tier without re-reading
     * the page.
     */
    owner_type?: string;
    /**
     * Reason - which arm matched. Stable enum for observability +
     * per-caller status-code mapping.
     */
    reason?: 'admin' | 'owner' | 'collaborator' | 'public_viewer' | 'none' | 'page_not_found' | 'owner_type_pending';
    /**
     * Role - the resolved role. "owner" / "editor" / "viewer" /
     * "none". Independent of IsEditor (viewer + none both have
     * IsEditor=false but different roles).
     */
    role?: 'owner' | 'editor' | 'viewer' | 'none';
};

