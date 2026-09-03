/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventVRChatInstanceWaitlistJoinOut = {
    /**
     * EventID is the owning event (prefixed).
     */
    event_id?: string;
    /**
     * ID is the waitlist row id (bare UUID - no prefix assigned).
     */
    id?: string;
    /**
     * InstanceID is the VRChat instance link row (bare UUID).
     */
    instance_id?: string;
    /**
     * JoinedAt is the join time (RFC3339, microseconds).
     */
    joined_at?: string;
    /**
     * Position is the caller's 1-based rank among active waiters,
     * oldest join first. Informational only - no seat is reserved;
     * VRChat instance join order is not something this API controls.
     */
    position?: number;
};

