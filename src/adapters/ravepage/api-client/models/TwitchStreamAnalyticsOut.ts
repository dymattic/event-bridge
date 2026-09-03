/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TwitchStreamLogOut } from './TwitchStreamLogOut';
export type TwitchStreamAnalyticsOut = {
    /**
     * Average viewer count across streams.
     */
    avg_viewers?: number;
    /**
     * Most frequently streamed category.
     */
    most_played_game?: string;
    /**
     * Highest peak viewer count.
     */
    peak_viewers?: number;
    /**
     * Recent streams; non-nil slice.
     */
    recent_streams?: Array<TwitchStreamLogOut>;
    /**
     * Total hours streamed.
     */
    total_hours_streamed?: number;
    /**
     * Total stream count.
     */
    total_streams?: number;
};

