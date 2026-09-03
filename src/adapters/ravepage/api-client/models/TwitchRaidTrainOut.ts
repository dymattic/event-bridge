/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TwitchRaidTrainStopOut } from './TwitchRaidTrainStopOut';
export type TwitchRaidTrainOut = {
    /**
     * Creation time.
     */
    created_at?: string;
    /**
     * User who created the train (prefix: 'usr_').
     */
    created_by_user_id?: string;
    /**
     * End time.
     */
    ended_at?: string;
    /**
     * Raid train ID (prefix: 'trr_').
     */
    id?: string;
    /**
     * Raid train name.
     */
    name?: string;
    /**
     * Scheduled start time.
     */
    scheduled_start?: string;
    /**
     * Actual start time.
     */
    started_at?: string;
    /**
     * Train status.
     */
    status?: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
    /**
     * Stops in order; non-nil slice.
     */
    stops?: Array<TwitchRaidTrainStopOut>;
};

