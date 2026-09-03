/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StreamPublishIn = {
    /**
     * EventID associates the set with an event (`evt_<uuid>` or bare
     * UUID). Omit to leave the existing association unchanged.
     */
    event_id?: string;
    /**
     * Visibility is the new set read-audience. Omit to leave unchanged.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

