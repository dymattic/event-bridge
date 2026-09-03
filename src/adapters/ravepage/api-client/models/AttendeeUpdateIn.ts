/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AttendeeUpdateIn = {
    /**
     * Notes is optional. JSON null is accepted .
     */
    notes?: string;
    /**
     * Status is optional. One of `going|interested|declined|waitlisted`
     * when non-nil.
     */
    status?: 'going' | 'interested' | 'declined' | 'waitlisted';
};

