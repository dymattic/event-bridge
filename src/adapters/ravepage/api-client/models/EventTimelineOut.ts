/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { TimelineSlotOut } from './TimelineSlotOut';
import type { TimelineSlotPerformerOut } from './TimelineSlotPerformerOut';
export type EventTimelineOut = {
    /**
     * EventID is the parent event's prefixed identifier.
     * Wire form: `evt_<uuid>`.
     */
    event_id?: EventID;
    /**
     * Slots is the ordered slice of timeline slots (ordered by
     * slot_number ASC). Always a non-nil slice on the wire.
     */
    slots?: Array<TimelineSlotOut>;
    /**
     * Unscheduled is the slice of performer entries attached to
     * the event WITHOUT a slot_id .
     * Always a non-nil slice on the wire (empty when no
     * unscheduled performers exist).
     */
    unscheduled?: Array<TimelineSlotPerformerOut>;
};

