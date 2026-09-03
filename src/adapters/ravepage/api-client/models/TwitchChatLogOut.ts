/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TwitchChatLogEntryOut } from './TwitchChatLogEntryOut';
export type TwitchChatLogOut = {
    /**
     * Chat messages; non-nil slice.
     */
    items?: Array<TwitchChatLogEntryOut>;
    /**
     * Cursor for next page.
     */
    next_cursor?: string;
    /**
     * Total message count.
     */
    total?: number;
};

