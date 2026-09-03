/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookingID } from './BookingID';
import type { EventPerformerID } from './EventPerformerID';
import type { PerformerID } from './PerformerID';
export type TimelineSlotPerformerOut = {
    /**
     * AcceptanceStatus mirrors `event_performers.acceptance_status`.
     * One of `"pending"`, `"accepted"`, `"declined"`.
     */
    acceptance_status?: 'pending' | 'accepted' | 'declined';
    /**
     * BillingOrder mirrors `event_performers.billing_order`.
     */
    billing_order?: number;
    /**
     * BookingID is the linked BookingRequest row when one exists.
     * Wire form: `bk_<uuid>`. nil when no booking is linked.
     */
    booking_id?: BookingID;
    /**
     * BookingNeedsReconfirmation mirrors the linked booking's
     * reconfirmation flag. nil when no booking is linked.
     */
    booking_needs_reconfirmation?: boolean;
    /**
     * BookingStatus is the linked booking's status. nil when no
     * booking is linked.
     */
    booking_status?: 'pending' | 'accepted' | 'declined' | 'cancelled';
    /**
     * EventPerformerID is the EventPerformer row id.
     * Wire form: `evp_<uuid>`.
     */
    event_performer_id?: EventPerformerID;
    /**
     * IsHeadliner mirrors `event_performers.is_headliner`.
     */
    is_headliner?: boolean;
    /**
     * NeedsReconfirmation mirrors
     * `event_performers.needs_reconfirmation`. True when a slot
     * edit invalidated the prior acceptance.
     */
    needs_reconfirmation?: boolean;
    /**
     * PerformerID is the linked performer profile id.
     * Wire form: `perf_<uuid>`.
     */
    performer_id?: PerformerID;
    /**
     * PerformerName is the joined `performers.name` value. NOT
     * empty when a row exists.
     */
    performer_name?: string;
};

