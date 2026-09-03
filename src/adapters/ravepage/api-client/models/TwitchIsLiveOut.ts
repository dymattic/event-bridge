/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TwitchStreamInfoOut } from './TwitchStreamInfoOut';
export type TwitchIsLiveOut = {
    /**
     * Whether the broadcaster is currently live.
     */
    is_live?: boolean;
    /**
     * Stream info if live; null otherwise.
     */
    stream?: TwitchStreamInfoOut;
};

