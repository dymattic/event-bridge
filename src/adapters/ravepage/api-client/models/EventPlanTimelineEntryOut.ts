/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventPlanItemID } from './EventPlanItemID';
import type { EventSlotID } from './EventSlotID';
export type EventPlanTimelineEntryOut = {
    ends_at?: string;
    event_id?: EventID;
    event_slot_id?: EventSlotID;
    item_id?: EventPlanItemID;
    note?: string;
    order_index?: number;
    starts_at?: string;
    title?: string;
};

