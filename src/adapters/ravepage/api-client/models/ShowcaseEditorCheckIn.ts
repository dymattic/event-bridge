/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShowcaseEditorCheckIn = {
    /**
     * IsAdmin - caller's admin flag from the gateway-signed claim's
     * roles. When true, short-circuits to (is_editor=true,
     * role=owner, reason=admin).
     */
    is_admin?: boolean;
    /**
     * PageID - the showcase page whose editor predicate is being
     * resolved. Accepts bare-UUID or `shp_<uuid>` prefixed form.
     */
    page_id?: string;
    /**
     * UserID - the caller whose editor predicate is being evaluated.
     * Accepts bare-UUID or `usr_<uuid>` prefixed form.
     */
    user_id?: string;
};

