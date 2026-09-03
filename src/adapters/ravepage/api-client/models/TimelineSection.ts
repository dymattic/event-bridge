/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventSummary } from './EventSummary';
export type TimelineSection = {
    /**
     * Count is the number of events in this section.
     */
    count?: number;
    /**
     * Events is the list of summaries in this section. Always
     * non-nil .
     */
    events?: Array<EventSummary>;
    /**
     * Key is one of `live_now | starting_soon | today | tomorrow |
     * weekend | later | past`.
     */
    key?: string;
    /**
     * Label is the human-readable section title.
     */
    label?: string;
};

