/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventInvitationOut } from './EventInvitationOut';
export type EventInvitationListOut = {
    /**
     * Items is the paginated page. Never nil - empty result is `[]`.
     */
    items?: Array<EventInvitationOut>;
    /**
     * Total is the unpaginated row count for this filter set.
     */
    total?: number;
};

