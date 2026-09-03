/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BookingRequestOut = {
    /**
     * Budget - booking_requests.budget. Empty when NULL.
     */
    budget?: string;
    /**
     * EventDate - booking_requests.event_date as RFC3339 string.
     * Empty when NULL.
     */
    event_date?: string;
    /**
     * EventID - booking_requests.event_id as bare-UUID. Empty when
     * the booking is event-less .
     */
    event_id?: string;
    /**
     * EventName - booking_requests.event_name. Empty when NULL.
     */
    event_name?: string;
    /**
     * ID - booking_requests.id as bare-UUID string.
     */
    id?: string;
    /**
     * Message - booking_requests.message. Empty when NULL. Truncated
     * at the consumer side .
     */
    message?: string;
    /**
     * RequesterUserID - booking_requests.requester_user_id as bare-
     * UUID string. NEVER empty (the row's owner).
     */
    requester_user_id?: string;
    /**
     * TargetDisplayName - booking_requests.target_display_name.
     * Empty when NULL.
     */
    target_display_name?: string;
    /**
     * TargetUserID - booking_requests.target_user_id as bare-UUID.
     * NEVER empty in the response - the contract filters out NULL
     * rows at source .
     */
    target_user_id?: string;
    /**
     * VenueName - booking_requests.venue_name. Empty when NULL.
     */
    venue_name?: string;
};

