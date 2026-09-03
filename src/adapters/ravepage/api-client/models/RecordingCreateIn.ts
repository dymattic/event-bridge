/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecordingTracklistItemIn } from './RecordingTracklistItemIn';
export type RecordingCreateIn = {
    /**
     * EndedAt is the set end (RFC3339). Optional; when present it must
     * be after started_at.
     */
    ended_at?: string;
    /**
     * EventID attaches the set to an event (`evt_<uuid>`). Optional.
     */
    event_id?: string;
    /**
     * PerformerID is the performer identity the set was performed as
     * (`perf_<uuid>`). Optional.
     */
    performer_id?: string;
    /**
     * RightsConfirmed is the uploader's affirmation that they hold or
     * have cleared the rights to host this recording, including the
     * underlying tracks. MUST be true - 422 otherwise.
     */
    rights_confirmed?: boolean;
    /**
     * Source marks how the set was produced. Only `recorded` is
     * accepted on this endpoint; empty defaults to `recorded`.
     */
    source?: 'recorded';
    /**
     * StartedAt is the set start (RFC3339). Required.
     */
    started_at?: string;
    /**
     * Title is the set title. Optional.
     */
    title?: string;
    /**
     * Tracklist is the stored tracklist with in-recording offsets.
     * Optional - omitted leaves the play-log-derived tracklist as the
     * only source.
     */
    tracklist?: Array<RecordingTracklistItemIn>;
    /**
     * Visibility is the read-audience policy. Defaults to `private`.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

