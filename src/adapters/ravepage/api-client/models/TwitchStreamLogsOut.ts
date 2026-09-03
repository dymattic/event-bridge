/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TwitchStreamLogOut } from './TwitchStreamLogOut';
export type TwitchStreamLogsOut = {
    /**
     * Stream logs; non-nil slice.
     */
    items?: Array<TwitchStreamLogOut>;
    /**
     * Cursor for next page.
     */
    next_cursor?: string;
};

