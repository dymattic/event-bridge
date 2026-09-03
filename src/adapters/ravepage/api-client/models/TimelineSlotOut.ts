/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventSlotID } from './EventSlotID';
import type { TimelineSlotPerformerOut } from './TimelineSlotPerformerOut';
export type TimelineSlotOut = {
    /**
     * EndsAt is the slot end timestamp. Nullable.
     */
    ends_at?: string;
    /**
     * ID is the EventSlot identifier. Wire form: `slt_<uuid>`.
     */
    id?: EventSlotID;
    /**
     * Performers is the ordered slice of EventPerformer rows
     * attached to this slot, ordered by billing_order. Each entry
     * includes the linked booking's status when one exists.
     * Always a non-nil slice on the wire (empty when no
     * performers attached).
     */
    performers?: Array<TimelineSlotPerformerOut>;
    /**
     * SlotNumber is the ordering integer within the event.
     */
    slot_number?: number;
    /**
     * SlotTitle is the freeform slot title. Nullable.
     */
    slot_title?: string;
    /**
     * StageName is the freeform stage label. Nullable.
     */
    stage_name?: string;
    /**
     * StartsAt is the slot start timestamp. Nullable.
     */
    starts_at?: string;
};

