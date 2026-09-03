/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookingID } from './BookingID';
export type BookingChatOut = {
    /**
     * BookingID is the prefixed booking id echo. Wire form: `bk_<uuid>`.
     */
    booking_id?: BookingID;
    /**
     * Status is always "provisioning" - the matrix worker creates (or
     * reconciles) the room asynchronously.
     */
    status?: string;
};

