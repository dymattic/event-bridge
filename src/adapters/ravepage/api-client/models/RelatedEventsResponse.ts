/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventSummary } from './EventSummary';
export type RelatedEventsResponse = {
    same_genre?: Array<EventSummary>;
    /**
     * SameHost is up to 5 future events from the same organizer.
     */
    same_host?: Array<EventSummary>;
    /**
     * SameTimeWindow is up to 5 events starting within ±3 hours of
     * the parent event.
     */
    same_time_window?: Array<EventSummary>;
};

