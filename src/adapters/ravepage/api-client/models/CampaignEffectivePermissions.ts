/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CampaignEffectivePermissions = {
    /**
     * Permissions is the sorted permission bag the caller holds.
     */
    permissions?: Array<string>;
    /**
     * Role is one of viewer / publisher / editor / owner.
     */
    role?: string;
    /**
     * Source - one of owner / admin / collaborator_user / collaborator_group.
     */
    source?: string;
};

