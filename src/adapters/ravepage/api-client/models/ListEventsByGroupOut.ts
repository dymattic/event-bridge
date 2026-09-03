/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventByGroupSummary } from './EventByGroupSummary';
export type ListEventsByGroupOut = {
    /**
     * Items - visibility-filtered events sourced from the group's
     * organizer_type='group' AND organizer_id=group_id rows. Ordered
     * by starts_at DESC. Empty slice (never nil) when no rows match.
     */
    items?: Array<EventByGroupSummary>;
};

