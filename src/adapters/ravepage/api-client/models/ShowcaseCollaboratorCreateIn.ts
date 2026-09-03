/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShowcaseCollaboratorCreateIn = {
    /**
     * MinGroupRole - for group grants: minimum group-membership
     * role required (owner|admin|manager|member). NULL = any
     * member. Ignored for principal_type=user.
     */
    min_group_role?: string;
    /**
     * PrincipalID is the grantee id (UUID or prefixed-UUID).
     */
    principal_id?: string;
    /**
     * PrincipalType is the grantee kind.
     */
    principal_type?: 'user' | 'group';
    /**
     * Role is the grant role.
     */
    role?: 'owner' | 'editor' | 'viewer';
};

