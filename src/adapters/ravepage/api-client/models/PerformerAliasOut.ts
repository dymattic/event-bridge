/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerAliasID } from './PerformerAliasID';
import type { PerformerID } from './PerformerID';
import type { UserID } from './UserID';
export type PerformerAliasOut = {
    alias_name?: string;
    created_at?: string;
    created_by_user_id?: UserID;
    id?: PerformerAliasID;
    is_historical?: boolean;
    notes?: string;
    performer_id?: PerformerID;
    updated_at?: string;
};

