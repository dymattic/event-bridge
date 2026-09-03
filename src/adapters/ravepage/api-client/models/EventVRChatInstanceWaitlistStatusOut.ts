/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventVRChatInstanceWaitlistStatusOut = {
    /**
     * JoinedAt is the join time (RFC3339, microseconds); omitted when
     * not on the waitlist.
     */
    joined_at?: string;
    /**
     * Notified is true once a capacity-freed notification has fired
     * for this row (the instance opened up while the caller waited).
     */
    notified?: boolean;
    /**
     * OnWaitlist is true when the caller has an active (not-left) row.
     */
    on_waitlist?: boolean;
    /**
     * Position is the caller's 1-based rank; 0 when not on the waitlist.
     */
    position?: number;
};

