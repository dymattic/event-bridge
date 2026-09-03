/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecordingTracklistItemIn } from './RecordingTracklistItemIn';
export type RecordingTracklistPutIn = {
    /**
     * Tracklist is the full replacement list. An empty array clears the
     * stored tracklist, which makes the read fall back to the
     * play-log-derived one.
     */
    tracklist?: Array<RecordingTracklistItemIn>;
    /**
     * TracklistID REFERENCES an existing tracklist instead of inlining
     * items (`tl_<uuid>` or bare UUID). Mutually exclusive with a
     * non-empty `tracklist` - sending both is a 422. You must be a
     * member of the referenced tracklist. Several recordings may point
     * at one tracklist (a DJ playing the same set twice); editing it
     * then updates every recording that references it, which is the
     * point - no copy is made.
     */
    tracklist_id?: string;
};

