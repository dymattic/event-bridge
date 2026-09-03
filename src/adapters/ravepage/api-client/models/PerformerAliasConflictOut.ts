/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerAliasConflictID } from './PerformerAliasConflictID';
import type { PerformerAliasID } from './PerformerAliasID';
import type { PerformerID } from './PerformerID';
import type { UserID } from './UserID';
export type PerformerAliasConflictOut = {
    conflicting_alias_id?: PerformerAliasID;
    conflicting_performer_id?: PerformerID;
    created_at?: string;
    id?: PerformerAliasConflictID;
    proposed_alias?: string;
    proposed_by_user_id?: UserID;
    proposing_performer_id?: PerformerID;
    resolution_notes?: string;
    resolved_at?: string;
    resolved_by?: UserID;
    status?: 'open' | 'withdrawn' | 'approved_for_proposer' | 'rejected' | 'merged';
    updated_at?: string;
};

