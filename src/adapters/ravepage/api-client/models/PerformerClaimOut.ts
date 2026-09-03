/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerClaimID } from './PerformerClaimID';
import type { PerformerID } from './PerformerID';
import type { UserID } from './UserID';
export type PerformerClaimOut = {
    /**
     * AdminNotes is the optional admin-supplied resolution note. Nil
     * until the claim is resolved.
     */
    admin_notes?: string;
    /**
     * ClaimantUserID is the claimant's user id. Wire form `usr_<uuid>`.
     */
    claimant_user_id?: UserID;
    /**
     * CreatedAt is the row creation timestamp.
     */
    created_at?: string;
    /**
     * ID is the canonical prefixed claim identifier. Wire form
     * `pcl_<uuid>`.
     */
    id?: PerformerClaimID;
    /**
     * PerformerID is the claimed performer's prefixed id. Wire form
     * `perf_<uuid>`.
     */
    performer_id?: PerformerID;
    /**
     * Reason is the claimant-supplied justification.
     */
    reason?: string;
    /**
     * ResolvedAt is the resolution timestamp. Nil until resolved.
     */
    resolved_at?: string;
    /**
     * ResolvedBy is the prefixed user id of the admin who resolved
     * the claim. Nil until resolved.
     */
    resolved_by?: UserID;
    /**
     * Status is one of `pending|approved|rejected|disputed`.
     */
    status?: 'pending' | 'approved' | 'rejected' | 'disputed';
    /**
     * UpdatedAt is the last-modified timestamp.
     */
    updated_at?: string;
};

