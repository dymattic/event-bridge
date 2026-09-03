/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendshipOut } from './FriendshipOut';
export type FriendshipListOut = {
    /**
     * Items is the current page of friendship rows, newest first.
     * MUST be a JSON array - never `null`. Initialized to an empty
     * slice in the service.
     */
    items?: Array<FriendshipOut>;
    /**
     * Total is the total number of accepted-friend rows for the
     * caller across all pages.
     */
    total?: number;
};

