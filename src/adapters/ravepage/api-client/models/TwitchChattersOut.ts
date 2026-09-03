/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TwitchChatterOut } from './TwitchChatterOut';
export type TwitchChattersOut = {
    /**
     * Non-nil slice; empty channel emits [].
     */
    chatters?: Array<TwitchChatterOut>;
    /**
     * Total number of chatters.
     */
    total?: number;
};

