/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EditHistoryID } from './EditHistoryID';
import type { UserID } from './UserID';
export type EditHistoryEntryOut = {
    action?: string;
    created_at?: string;
    entity_id?: string;
    entity_type?: string;
    id?: EditHistoryID;
    label?: string;
    owner_user_id?: UserID;
    snapshot?: Record<string, any>;
};

