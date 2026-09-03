/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BeatgridMarker = {
    /**
     * Beat is the beat number this marker anchors (1 = a downbeat).
     */
    beat?: number;
    /**
     * BPM is the tempo from this marker until the next one.
     */
    bpm?: number;
    /**
     * PositionMS is the marker's offset from track start, milliseconds.
     */
    position_ms?: number;
};

