/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BookingUpdateIn = {
    /**
     * EventID links the booking to an event (evt_<uuid> or bare UUID).
     */
    event_id?: string;
    /**
     * IsActive toggles the soft-delete flag.
     */
    is_active?: boolean;
    /**
     * Message is the updated message.
     */
    message?: string;
    /**
     * PerformerID links the booking to a performer (perf_<uuid> or bare).
     */
    performer_id?: string;
    /**
     * SlotEndsAt is the slot end (RFC3339).
     */
    slot_ends_at?: string;
    /**
     * SlotID links the booking to an event slot (UUID).
     */
    slot_id?: string;
    /**
     * SlotStartsAt is the slot start (RFC3339).
     */
    slot_starts_at?: string;
    /**
     * SlotTitle is the slot's display title.
     */
    slot_title?: string;
    /**
     * StageName is the performance stage/area name.
     */
    stage_name?: string;
    /**
     * Status is the new status value (pending|accepted|declined|cancelled).
     */
    status?: 'pending' | 'accepted' | 'declined' | 'cancelled';
};

