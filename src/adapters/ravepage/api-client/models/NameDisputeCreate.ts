/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupID } from './GroupID';
import type { UserID } from './UserID';
export type NameDisputeCreate = {
    claimant_email?: string;
    claimant_name?: string;
    claimant_reason?: string;
    disputed_group_id?: GroupID;
    disputed_user_id?: UserID;
};

