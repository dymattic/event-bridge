/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClubClaimID } from './ClubClaimID';
import type { ClubID } from './ClubID';
import type { UserID } from './UserID';
export type ClubClaimOut = {
    admin_notes?: string;
    claimant_user_id?: UserID;
    club_id?: ClubID;
    created_at?: string;
    id?: ClubClaimID;
    reason?: string;
    resolved_at?: string;
    resolved_by?: UserID;
    status?: 'pending' | 'approved' | 'rejected' | 'disputed';
    updated_at?: string;
};

