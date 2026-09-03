/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TwitchRaidTrainOut } from './TwitchRaidTrainOut';
export type TwitchRaidTrainListOut = {
    /**
     * Raid trains; non-nil slice.
     */
    items?: Array<TwitchRaidTrainOut>;
    /**
     * Cursor for next page.
     */
    next_cursor?: string;
};

