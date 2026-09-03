/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventVisibility = {
    /**
     * Exists reports whether the event row was found.
     */
    exists?: boolean;
    /**
     * OrganizerID is the `events.organizer_id` column as a bare-UUID
     * string. Empty when null or when `Exists=false`.
     */
    organizer_id?: string;
    /**
     * OrganizerType is the `events.organizer_type` column. Empty
     * string when the column is null or when `Exists=false`.
     */
    organizer_type?: string;
    /**
     * Visible reports whether the supplied user_id (empty = anonymous)
     * passes the events-owned subset of
     * `event_visibility_clause(requester_id)`. Zero-value (false) when
     * `Exists=false`.
     */
    visible?: boolean;
};

