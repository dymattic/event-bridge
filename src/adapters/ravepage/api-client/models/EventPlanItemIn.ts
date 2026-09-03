/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventPlanItemIn = {
    /**
     * EventID accepts BOTH bare UUID and `evt_<uuid>`.
     */
    event_id?: string;
    /**
     * EventSlotID accepts BOTH bare UUID and `slt_<uuid>`; nil means
     * the user plans to attend the whole event (no pinned slot).
     */
    event_slot_id?: string;
    note?: string;
    order_index?: number;
};

