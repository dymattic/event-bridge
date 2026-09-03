/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventChatVisibilityOut = {
    /**
     * EventID is the prefixed event id echo.
     */
    event_id?: string;
    /**
     * IsPublic is the requested visibility (applies asynchronously).
     */
    is_public?: boolean;
    /**
     * Status is always "queued" - the matrix worker applies the flip.
     */
    status?: string;
};

