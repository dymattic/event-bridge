/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayedTrack } from './PlayedTrack';
export type StreamTracklistOut = {
    /**
     * Count is the number of tracks in this response page.
     */
    count?: number;
    /**
     * StreamID is the live stream the tracklist was derived from
     * (`strm_<uuid>`).
     */
    stream_id?: string;
    /**
     * Tracks is the ordered set tracklist (oldest-first, 1-based
     * position). Never null (empty slice when the set has no plays).
     */
    tracks?: Array<PlayedTrack>;
};

