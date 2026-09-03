/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventSlotID } from './EventSlotID';
export type EventPerformerUpdateIn = {
    /**
     * BillingOrder is the new listing order.
     */
    billing_order?: number;
    /**
     * EndsAt is the new slot end.
     */
    ends_at?: string;
    /**
     * GenreTags is the new list of genre tags.
     */
    genre_tags?: Array<string>;
    /**
     * IsHeadliner is the new headliner flag.
     */
    is_headliner?: boolean;
    /**
     * Notes are the new freeform notes.
     */
    notes?: string;
    /**
     * SlotID moves the performer to a different EventSlot on the
     * same event. Pass `null` to detach.
     */
    slot_id?: EventSlotID;
    /**
     * SlotTitle is the new slot title.
     */
    slot_title?: string;
    /**
     * StageName is the new stage label.
     */
    stage_name?: string;
    /**
     * StartsAt is the new slot start.
     */
    starts_at?: string;
};

