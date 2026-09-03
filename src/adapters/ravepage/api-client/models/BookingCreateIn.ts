/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventSlotID } from './EventSlotID';
import type { GroupID } from './GroupID';
import type { PerformerID } from './PerformerID';
import type { UserID } from './UserID';
export type BookingCreateIn = {
    /**
     * Budget is the offered budget/fee range.
     */
    budget?: string;
    /**
     * EventDate is the free-text event date.
     */
    event_date?: string;
    /**
     * EventID links the booking to a platform event - prefixed `evt_<uuid>`.
     */
    event_id?: EventID;
    /**
     * EventName is the free-text event name.
     */
    event_name?: string;
    /**
     * Message is the personalised note to the target.
     */
    message?: string;
    /**
     * PerformerID links the booking to a performer profile - `perf_<uuid>`.
     */
    performer_id?: PerformerID;
    /**
     * RequesterEmail is the contact email. REQUIRED.
     */
    requester_email?: string;
    /**
     * RequesterName is the full name of the person making the
     * request. REQUIRED .
     */
    requester_name?: string;
    /**
     * RequesterPhone is the optional phone number.
     */
    requester_phone?: string;
    /**
     * SlotEndsAt is the proposed slot end time. Legacy fallback.
     */
    slot_ends_at?: string;
    /**
     * SlotID is the preferred slot reference - `slt_<uuid>`.
     */
    slot_id?: EventSlotID;
    /**
     * SlotStartsAt is the proposed slot start time. Legacy fallback.
     */
    slot_starts_at?: string;
    /**
     * SlotTitle is the slot label.
     */
    slot_title?: string;
    /**
     * StageName is the stage or room name.
     */
    stage_name?: string;
    /**
     * TargetDisplayName is the free-text name used when neither user
     * nor group is registered.
     */
    target_display_name?: string;
    /**
     * TargetEntityType is the artist|venue|club|label hint used to
     * create the stub.
     */
    target_entity_type?: 'artist' | 'venue' | 'club' | 'label';
    /**
     * TargetGroupID is the registered-group target - prefixed `grp_<uuid>`.
     */
    target_group_id?: GroupID;
    /**
     * TargetUserID is the registered-user target - prefixed `usr_<uuid>`.
     * Mutually exclusive with TargetGroupID + TargetDisplayName at the
     * "at-least-one-set" level .
     */
    target_user_id?: UserID;
    /**
     * VenueDisplayName is used when the venue is unregistered.
     */
    venue_display_name?: string;
    /**
     * VenueName is the free-text venue name.
     */
    venue_name?: string;
};

