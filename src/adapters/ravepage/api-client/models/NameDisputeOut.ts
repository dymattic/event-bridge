/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupID } from './GroupID';
import type { NameDisputeID } from './NameDisputeID';
import type { UserID } from './UserID';
export type NameDisputeOut = {
    admin_notes?: string;
    claimant_email?: string;
    claimant_name?: string;
    claimant_reason?: string;
    created_at?: string;
    disputed_group_id?: GroupID;
    disputed_name?: string;
    disputed_user_id?: UserID;
    email_verified?: boolean;
    id?: NameDisputeID;
    resolved_at?: string;
    status?: 'pending' | 'under_review' | 'resolved' | 'dismissed';
    verified_at?: string;
};

