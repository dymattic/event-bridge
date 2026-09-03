/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityRevisionID } from './EntityRevisionID';
import type { UserID } from './UserID';
export type EntityRevisionOut = {
    actor_user_id?: UserID;
    change_summary?: string;
    created_at?: string;
    entity_id?: string;
    entity_type?: string;
    id?: EntityRevisionID;
    revision_number?: number;
    session_id?: string;
    /**
     * Snapshot is the opaque JSONB blob captured at the time of the
     * revision. Schema is writer-version-dependent.
     */
    snapshot?: Array<number>;
};

