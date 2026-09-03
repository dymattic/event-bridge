/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventSlotID } from './EventSlotID';
export type EventSlotOut = {
    /**
     * CreatedAt is the row creation timestamp.
     */
    created_at?: string;
    /**
     * EndsAt is the slot end timestamp. Nullable.
     */
    ends_at?: string;
    /**
     * EventID is the parent event's prefixed identifier.
     * Wire form: `evt_<uuid>`.
     */
    event_id?: EventID;
    /**
     * ID is the canonical prefixed event-slot identifier.
     * Wire form: `slt_<uuid>`.
     */
    id?: EventSlotID;
    slot_number?: number;
    /**
     * SlotTitle is the freeform slot title. Nullable; max 255.
     */
    slot_title?: string;
    /**
     * StageName is the freeform stage label.
     */
    stage_name?: string;
    /**
     * StartsAt is the slot start timestamp.
     */
    starts_at?: string;
    /**
     * UpdatedAt is the last-modified timestamp.
     */
    updated_at?: string;
};

