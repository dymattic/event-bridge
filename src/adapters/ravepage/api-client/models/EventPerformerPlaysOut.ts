/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayedTrack } from './PlayedTrack';
export type EventPerformerPlaysOut = {
    /**
     * PerformerID is the cross-worker performer (`perf_<uuid>`), null
     * for the unattributed group (plays with no performer linked).
     */
    performer_id?: string;
    /**
     * PerformerName is the resolved performer display name, null when
     * unattributed or the cross-worker name lookup was unavailable.
     */
    performer_name?: string;
    /**
     * Tracks is the ordered (played_at ASC) hydrated play list for this
     * performer. Never null (empty slice when none).
     */
    tracks?: Array<PlayedTrack>;
};

