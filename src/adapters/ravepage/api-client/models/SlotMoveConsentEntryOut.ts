/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerID } from './PerformerID';
export type SlotMoveConsentEntryOut = {
    /**
     * Allow - true grants unconfirmed slot moves to this grantee;
     * false explicitly denies (overrides an allowing global default).
     */
    allow?: boolean;
    /**
     * CreatedAt is the row creation timestamp.
     */
    created_at?: string;
    /**
     * GranteeID is the grantee id, prefixed by type: `usr_<uuid>` or
     * `grp_<uuid>`.
     */
    grantee_id?: string;
    /**
     * GranteeType scopes GranteeID: 'user' = organizer user, 'group' =
     * organizer group.
     */
    grantee_type?: 'user' | 'group';
    /**
     * ID is the entry id (bare UUID).
     */
    id?: string;
    /**
     * PerformerID is the owning performer - `perf_<uuid>`.
     */
    performer_id?: PerformerID;
    /**
     * UpdatedAt is the last-modified timestamp.
     */
    updated_at?: string;
};

