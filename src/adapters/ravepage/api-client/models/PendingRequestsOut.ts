/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendshipOut } from './FriendshipOut';
export type PendingRequestsOut = {
    /**
     * Incoming is the list of pending requests waiting on the
     * caller's acceptance. MUST be a JSON array - never `null`.
     */
    incoming?: Array<FriendshipOut>;
    /**
     * Outgoing is the list of pending requests the caller has sent
     * and are waiting on the other side. MUST be a JSON array -
     * never `null`.
     */
    outgoing?: Array<FriendshipOut>;
};

