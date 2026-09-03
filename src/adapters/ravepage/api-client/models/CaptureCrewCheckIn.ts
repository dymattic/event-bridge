/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CaptureCrewCheckIn = {
    /**
     * EventID - the event whose crew predicate is being resolved.
     * Accepts bare-UUID or `evt_<uuid>` prefixed form.
     */
    event_id?: string;
    /**
     * UserID - the user whose crew standing is being evaluated.
     * Accepts bare-UUID or `usr_<uuid>` prefixed form.
     */
    user_id?: string;
};

