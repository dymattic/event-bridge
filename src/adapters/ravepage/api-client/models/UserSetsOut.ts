/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserSetSummaryOut } from './UserSetSummaryOut';
export type UserSetsOut = {
    /**
     * Count is the number of sets in this response page.
     */
    count?: number;
    /**
     * Sets are the distinct sets the user has played, newest-first.
     * Never null (empty slice when the user has played no sets).
     */
    sets?: Array<UserSetSummaryOut>;
    /**
     * UserID is the caller (`usr_<uuid>`), echoed back for client
     * correlation.
     */
    user_id?: string;
};

