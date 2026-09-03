/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CampaignCollaboratorID } from './CampaignCollaboratorID';
import type { CampaignID } from './CampaignID';
import type { UserID } from './UserID';
export type CampaignCollaboratorOut = {
    /**
     * CampaignID is the cmp_<uuid> identifier of the owning campaign.
     */
    campaign_id?: CampaignID;
    /**
     * GrantedAt - row creation timestamp.
     */
    granted_at?: string;
    /**
     * GrantedBy - prefixed UserID of the granter, nil on SET NULL.
     */
    granted_by?: UserID;
    /**
     * ID is the prefixed cmpc_<uuid> identifier.
     */
    id?: CampaignCollaboratorID;
    /**
     * Permissions - the effective permission bag (non-nil; empty if none).
     */
    permissions?: Array<string>;
    /**
     * PrincipalID is the bare UUID .
     */
    principal_id?: string;
    /**
     * PrincipalType - one of "user", "group".
     */
    principal_type?: string;
    /**
     * Role - one of viewer / editor / publisher / owner.
     */
    role?: string;
};

