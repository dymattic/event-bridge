/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CampaignCollaboratorUpsert = {
    /**
     * Permissions - optional explicit permission bag overriding role
     * defaults. Nil means "use role defaults". Empty slice means "no
     * permissions" (deliberately distinct from nil).
     */
    permissions?: Array<string>;
    /**
     * PrincipalID - prefixed or bare UUID of the granted principal.
     */
    principal_id?: string;
    /**
     * PrincipalType - one of "user", "group".
     */
    principal_type?: string;
    /**
     * Role - default "viewer". One of viewer / editor / publisher / owner.
     */
    role?: string;
};

