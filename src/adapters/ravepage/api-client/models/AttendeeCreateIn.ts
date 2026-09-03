/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AttendeeCreateIn = {
    /**
     * Notes is OPTIONAL. Pointer-to-string so the decoder distinguishes
     * "absent" from "present-with-empty-string" `).
     */
    notes?: string;
    /**
     * Status is REQUIRED. One of `going|interested|declined|waitlisted`.
     */
    status?: 'going' | 'interested' | 'declined' | 'waitlisted';
    /**
     * UserID is OPTIONAL on the `/attendees` POST path. When absent
     * the service stamps the actor's user id.
     */
    user_id?: string;
};

