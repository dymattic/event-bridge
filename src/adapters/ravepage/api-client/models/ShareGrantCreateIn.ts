/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShareGrantCreateIn = {
    /**
     * MinGroupRole - group principals only (dropped otherwise):
     * owner | admin | manager | member.
     */
    min_group_role?: string;
    /**
     * PrincipalID is REQUIRED: bare UUID or `usr_`/`grp_` prefixed.
     */
    principal_id?: string;
    /**
     * PrincipalType is REQUIRED: user | group.
     */
    principal_type?: string;
    /**
     * Role: viewer | editor (default viewer; library shares reject editor).
     */
    role?: string;
};

