/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
export type AttendeeOut = {
    /**
     * CreatedAt is the RSVP timestamp.
     */
    created_at?: string;
    event_id?: EventID;
    /**
     * Notes is optional. JSON null when NULL in DB.
     */
    notes?: string;
    /**
     * Status is one of `going|interested|declined|waitlisted`.
     */
    status?: 'going' | 'interested' | 'declined' | 'waitlisted';
    /**
     * UserID is the attendee's user reference. Bare UUID -
     */
    user_id?: string;
};

