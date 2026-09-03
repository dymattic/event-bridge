/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FollowOut } from './FollowOut';
export type FollowingListOut = {
    /**
     * Items is the current page of follow rows, newest first.
     * MUST be a JSON array - never `null`. Initialized to an empty
     * slice in the service.
     */
    items?: Array<FollowOut>;
    /**
     * Total is the total number of entities the user currently
     * follows.
     */
    total?: number;
};

