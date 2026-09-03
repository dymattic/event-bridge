/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookingID } from './BookingID';
import type { EventID } from './EventID';
import type { EventSlotID } from './EventSlotID';
import type { GroupID } from './GroupID';
import type { PerformerID } from './PerformerID';
import type { UnregisteredEntityID } from './UnregisteredEntityID';
import type { UserID } from './UserID';
export type BookingOut = {
    /**
     * Budget is the budget/fee range (nullable).
     */
    budget?: string;
    /**
     * CreatedAt is the creation timestamp.
     */
    created_at?: string;
    /**
     * EventDate is the free-text event date (nullable).
     */
    event_date?: string;
    /**
     * EventID is the linked event (nullable).
     */
    event_id?: EventID;
    /**
     * EventName is the free-text event name (nullable).
     */
    event_name?: string;
    /**
     * ID is the canonical prefixed booking identifier. Wire form: `bk_<uuid>`.
     */
    id?: BookingID;
    /**
     * IsActive is the soft-delete flag.
     */
    is_active?: boolean;
    /**
     * LastAcceptedAt is the timestamp of the performer's last explicit
     * acceptance/reconfirmation (nullable).
     */
    last_accepted_at?: string;
    /**
     * LastAcceptedSlotEndsAt is the snapshot triplet's end (nullable).
     */
    last_accepted_slot_ends_at?: string;
    /**
     * LastAcceptedSlotID is the snapshot triplet's slot id (nullable).
     */
    last_accepted_slot_id?: EventSlotID;
    /**
     * LastAcceptedSlotStartsAt is the snapshot triplet's start (nullable).
     */
    last_accepted_slot_starts_at?: string;
    /**
     * Message is the message text (nullable).
     */
    message?: string;
    /**
     * NeedsReconfirmation is the slot-edit-cascade flag.
     */
    needs_reconfirmation?: boolean;
    /**
     * PerformerID is the linked performer (nullable).
     */
    performer_id?: PerformerID;
    /**
     * RequesterEmail is the requester's email.
     */
    requester_email?: string;
    /**
     * RequesterName is the requester's full name.
     */
    requester_name?: string;
    /**
     * RequesterPhone is the requester's phone (nullable).
     */
    requester_phone?: string;
    /**
     * RequesterUserID is the requester's user id when they were
     * authenticated.
     */
    requester_user_id?: UserID;
    /**
     * SlotEndsAt is the slot end time (nullable).
     */
    slot_ends_at?: string;
    /**
     * SlotID is the linked slot (nullable).
     */
    slot_id?: EventSlotID;
    /**
     * SlotStartsAt is the slot start time (nullable).
     */
    slot_starts_at?: string;
    /**
     * SlotTitle is the slot label (nullable).
     */
    slot_title?: string;
    /**
     * StageName is the stage or room name (nullable).
     */
    stage_name?: string;
    /**
     * Status is one of `pending|accepted|declined|cancelled`.
     */
    status?: 'pending' | 'accepted' | 'declined' | 'cancelled';
    target_display_name?: string;
    /**
     * TargetGroupID - `grp_<uuid>` or null.
     */
    target_group_id?: GroupID;
    /**
     * TargetUnregisteredID - `urg_<uuid>` or null.
     */
    target_unregistered_id?: UnregisteredEntityID;
    /**
     * TargetUserID - `usr_<uuid>` or null.
     */
    target_user_id?: UserID;
    /**
     * UpdatedAt is the last-update timestamp.
     */
    updated_at?: string;
    /**
     * VenueName is the free-text venue name (nullable).
     */
    venue_name?: string;
};

