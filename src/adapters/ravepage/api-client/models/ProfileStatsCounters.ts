/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileStatsCounters = {
    /**
     * EventsHosted - events this entity has organized.
     */
    events_hosted?: number;
    /**
     * EventsPerformed - accepted EventPerformer rows for performers.
     */
    events_performed?: number;
    /**
     * Followers - follow rows pointing at this entity.
     */
    followers?: number;
    /**
     * Following - user-only: entities this user follows.
     */
    following?: number;
    /**
     * MemberCount - group/club member count; nil for user/performer.
     */
    member_count?: number;
    /**
     * TotalPlays - sum of media_play + track_listen aggregates.
     */
    total_plays?: number;
    /**
     * TotalViews - profile_view aggregate for this entity.
     */
    total_views?: number;
};

