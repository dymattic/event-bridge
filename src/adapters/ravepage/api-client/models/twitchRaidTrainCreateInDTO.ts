/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { twitchRaidTrainStopInDTO } from './twitchRaidTrainStopInDTO';
/**
 * Create payload for POST /twitch/raid-trains.
 */
export type twitchRaidTrainCreateInDTO = {
    /**
     * Train name (required).
     */
    name?: string;
    /**
     * Optional ISO-8601 start time.
     */
    scheduled_start?: string;
    /**
     * Ordered list of stops (required, >=1).
     */
    stops?: Array<twitchRaidTrainStopInDTO>;
};

