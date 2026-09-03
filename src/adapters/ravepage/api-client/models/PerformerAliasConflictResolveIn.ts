/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PerformerAliasConflictResolveIn = {
    /**
     * Notes is the optional rationale (max 2000 chars).
     */
    notes?: string;
    /**
     * Status is the terminal status - withdrawn / approved_for_proposer
     * / rejected / merged.
     */
    status?: 'withdrawn' | 'approved_for_proposer' | 'rejected' | 'merged';
};

