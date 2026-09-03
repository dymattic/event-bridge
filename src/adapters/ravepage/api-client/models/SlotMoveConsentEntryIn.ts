/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SlotMoveConsentEntryIn = {
    /**
     * Allow - omit for true (grant). Explicit false records a deny
     * override.
     */
    allow?: boolean;
    /**
     * GranteeID is the grantee id - `usr_<uuid>` / `grp_<uuid>` or bare
     * UUID. Required.
     */
    grantee_id?: string;
    /**
     * GranteeType scopes GranteeID. Required.
     */
    grantee_type?: 'user' | 'group';
};

