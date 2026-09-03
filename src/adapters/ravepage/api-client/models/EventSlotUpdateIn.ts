/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventSlotUpdateIn = {
    endsAt?: string;
    endsAtSet?: boolean;
    slotNumber?: number;
    /**
     * SlotNumberSet records whether the payload contained
     * `slot_number` at all. Distinct from `SlotNumber != nil`
     * only on a future "explicit null" rejection path; today
     * the two carry the same signal.
     */
    slotNumberSet?: boolean;
    slotTitle?: string;
    slotTitleSet?: boolean;
    stageName?: string;
    stageNameSet?: boolean;
    startsAt?: string;
    /**
     * StartsAtSet / StartsAt: Set==false means "field absent".
     * Set==true with StartsAt==nil means "explicit JSON null".
     * Set==true with StartsAt!=nil means "explicit JSON value".
     */
    startsAtSet?: boolean;
};

