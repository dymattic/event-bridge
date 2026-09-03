/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityRevisionID } from './EntityRevisionID';
import type { UserID } from './UserID';
export type EntityRevisionSummary = {
    /**
     * ActorUserID is the prefixed UserID of the writer, nil on SET NULL.
     */
    actor_user_id?: UserID;
    /**
     * ChangeSummary is the optional human-readable summary.
     */
    change_summary?: string;
    /**
     * CreatedAt is the snapshot capture timestamp.
     */
    created_at?: string;
    /**
     * EntityID is the bare UUID of the owning entity (campaign).
     */
    entity_id?: string;
    entity_type?: string;
    /**
     * ID is the prefixed erv_<uuid> identifier.
     */
    id?: EntityRevisionID;
    /**
     * RevisionNumber is the monotonic per-entity sequence (1-based).
     */
    revision_number?: number;
    /**
     * SessionID is the optional client-supplied session correlator.
     */
    session_id?: string;
};

