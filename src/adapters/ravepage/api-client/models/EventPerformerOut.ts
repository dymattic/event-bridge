/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventPerformerID } from './EventPerformerID';
import type { EventSlotID } from './EventSlotID';
import type { PerformerID } from './PerformerID';
import type { PerformerOut } from './PerformerOut';
export type EventPerformerOut = {
    /**
     * AcceptanceStatus is the booking acceptance state - one of
     * `pending` / `accepted` / `declined`.
     */
    acceptance_status?: 'pending' | 'accepted' | 'declined';
    /**
     * BillingOrder controls the listing order.
     */
    billing_order?: number;
    /**
     * CreatedAt is the row creation timestamp.
     */
    created_at?: string;
    /**
     * EndsAt is the optional slot end.
     */
    ends_at?: string;
    /**
     * EventID is the parent event reference.
     */
    event_id?: EventID;
    /**
     * GenreTags is the optional list of genre tags.
     */
    genre_tags?: Array<string>;
    /**
     * ID is the prefixed event-performer identifier (`ep_<uuid>`).
     */
    id?: EventPerformerID;
    /**
     * IsHeadliner marks the slot as the headliner.
     */
    is_headliner?: boolean;
    /**
     * NeedsReconfirmation flags the slot when a non-trivial edit
     * requires the performer to re-accept.
     */
    needs_reconfirmation?: boolean;
    /**
     * Notes are the optional freeform notes.
     */
    notes?: string;
    /**
     * Performer is the optional eager-loaded performer projection.
     */
    performer?: PerformerOut;
    /**
     * PerformerID is the assigned performer reference.
     */
    performer_id?: PerformerID;
    /**
     * SlotID is the optional event-slot assignment.
     */
    slot_id?: EventSlotID;
    /**
     * SlotTitle is the optional slot title.
     */
    slot_title?: string;
    /**
     * StageName is the optional stage label.
     */
    stage_name?: string;
    /**
     * StartsAt is the optional slot start.
     */
    starts_at?: string;
    /**
     * UpdatedAt is the last-modified timestamp.
     */
    updated_at?: string;
};

