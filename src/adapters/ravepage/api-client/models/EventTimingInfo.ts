/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventTimingInfo = {
    /**
     * ComputedStatus is one of `live | starting_soon | ending_soon |
     * upcoming | ended | draft | cancelled`.
     */
    computed_status?: 'live' | 'starting_soon' | 'ending_soon' | 'upcoming' | 'ended' | 'draft' | 'cancelled';
    /**
     * DurationMinutes is the total event duration in minutes (None
     * when starts_at or ends_at is missing).
     */
    duration_minutes?: number;
    /**
     * EndsInMinutes is the number of minutes until ends_at (None when
     * no ends_at OR the event has already ended).
     */
    ends_in_minutes?: number;
    /**
     * IsEndingSoon is true when the event is currently live and ends
     * within 30 minutes.
     */
    is_ending_soon?: boolean;
    /**
     * IsLive is true when the event's stored status is "live" OR the
     * current time is within (starts_at, effective_ends_at) and the
     * event isn't draft/ended/cancelled.
     */
    is_live?: boolean;
    /**
     * IsStartingSoon is true when the event has not yet started but
     * starts within 60 minutes.
     */
    is_starting_soon?: boolean;
    /**
     * StartsInMinutes is the number of minutes until starts_at
     * (None when the event has already started).
     */
    starts_in_minutes?: number;
};

