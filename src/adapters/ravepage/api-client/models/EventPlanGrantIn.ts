/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventPlanGrantIn = {
    /**
     * MinGroupRole only valid when principal_type='group'. When nil,
     * any group member qualifies.
     */
    min_group_role?: string;
    /**
     * PrincipalID accepts BOTH bare UUID and `<prefix>_<uuid>` .
     */
    principal_id?: string;
    principal_type?: string;
    /**
     * Role defaults to "viewer" when empty/unset on the wire.
     */
    role?: string;
};

