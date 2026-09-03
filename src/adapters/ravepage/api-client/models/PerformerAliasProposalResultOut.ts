/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerAliasConflictOut } from './PerformerAliasConflictOut';
import type { PerformerAliasOut } from './PerformerAliasOut';
export type PerformerAliasProposalResultOut = {
    /**
     * Alias is set when the proposed alias attached cleanly.
     */
    alias?: PerformerAliasOut;
    /**
     * Conflict is set when the proposed name collided with another
     * claimed performer owned by a different user.
     */
    conflict?: PerformerAliasConflictOut;
};

