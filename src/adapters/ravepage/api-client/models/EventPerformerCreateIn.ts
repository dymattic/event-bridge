/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventSlotID } from './EventSlotID';
import type { PerformerID } from './PerformerID';
import type { PerformerTypeID } from './PerformerTypeID';
export type EventPerformerCreateIn = {
    /**
     * BillingOrder controls the listing order; defaults to 0.
     */
    billing_order?: number;
    /**
     * EndsAt is the optional slot end (RFC3339 UTC).
     */
    ends_at?: string;
    /**
     * GenreTags is the optional list of genre tags for this slot.
     */
    genre_tags?: Array<string>;
    /**
     * IsHeadliner marks the slot as the headliner.
     */
    is_headliner?: boolean;
    /**
     * Notes are the optional freeform notes (max 500).
     */
    notes?: string;
    /**
     * PerformerID is the existing performer reference. Leave blank
     * to auto-create.
     */
    performer_id?: PerformerID;
    /**
     * PerformerName is the new performer name when PerformerID is
     * absent (max 255).
     */
    performer_name?: string;
    /**
     * PerformerTypeID is the optional role-type for auto-create.
     */
    performer_type_id?: PerformerTypeID;
    /**
     * SlotID is the optional event-slot assignment (prefix `slt_`).
     */
    slot_id?: EventSlotID;
    /**
     * SlotTitle is the optional human-readable slot title, e.g.
     * "Opening Set" / "Main Room Headliner".
     */
    slot_title?: string;
    /**
     * StageName is the optional stage label (max 255).
     */
    stage_name?: string;
    /**
     * StartsAt is the optional slot start (RFC3339 UTC). Overridden
     * by the slot's own time when SlotID is set.
     */
    starts_at?: string;
};

