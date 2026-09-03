/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TwitchFollowerInfoOut } from './TwitchFollowerInfoOut';
export type TwitchFollowersOut = {
    /**
     * Non-nil slice.
     */
    followers?: Array<TwitchFollowerInfoOut>;
    /**
     * Pagination cursor.
     */
    next_cursor?: string;
    /**
     * Total follower count.
     */
    total?: number;
};

