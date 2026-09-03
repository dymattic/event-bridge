/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventCaptureCrewMemberOut = {
    /**
     * AddedBy is the editor who added the member (prefixed).
     */
    added_by?: string;
    /**
     * CreatedAt is the add time (RFC3339, microseconds).
     */
    created_at?: string;
    /**
     * EventID is the owning event (prefixed).
     */
    event_id?: string;
    /**
     * ID is the roster row id (bare UUID - no prefix assigned).
     */
    id?: string;
    /**
     * Tier is the rig tier.
     */
    tier?: 'panel' | 'camera' | 'log';
    /**
     * UserID is the crew member (prefixed).
     */
    user_id?: string;
};

