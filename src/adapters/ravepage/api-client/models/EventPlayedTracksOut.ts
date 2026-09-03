/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventPerformerPlaysOut } from './EventPerformerPlaysOut';
export type EventPlayedTracksOut = {
    /**
     * EventID echoes the requested event (`evt_<uuid>` wire form).
     */
    event_id?: string;
    /**
     * Performers are the per-performer play groups, ordered by each
     * group's earliest play time (ASC). The unattributed group, when
     * present, sorts by its own earliest play like any other. Never
     * null (empty slice for an event with no plays).
     */
    performers?: Array<EventPerformerPlaysOut>;
};

