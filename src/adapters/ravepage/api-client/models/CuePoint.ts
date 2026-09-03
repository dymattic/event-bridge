/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CuePoint = {
    /**
     * Hotcue is the assigned hotcue slot (-1 = unassigned).
     */
    hotcue?: number;
    /**
     * Kind is the software's cue class (cue|fade_in|fade_out|load|grid|loop).
     */
    kind?: string;
    /**
     * LenMS is the loop/region length in milliseconds (0 = point cue).
     */
    len_ms?: number;
    /**
     * Name as labeled in the DJ software.
     */
    name?: string;
    /**
     * StartMS is the cue position from track start, milliseconds.
     */
    start_ms?: number;
    /**
     * Type is the software-native numeric cue type.
     */
    type?: number;
};

