/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecordingLoudnessSummary } from './RecordingLoudnessSummary';
import type { RecordingReleaseRef } from './RecordingReleaseRef';
export type RecordingOut = {
    /**
     * AudioReady is true when hosted audio is attached and playable via
     * media-delivery's range-serving stream endpoint.
     */
    audio_ready?: boolean;
    /**
     * EndedAt is the set end timestamp (RFC3339 UTC); null while live.
     */
    ended_at?: string;
    /**
     * EventID is the set-level event association (`evt_<uuid>`); null when
     * unattached.
     */
    event_id?: string;
    /**
     * HasStoredTracklist is true when an uploaded tracklist is linked
     * (it wins over the play-log-derived one on the tracklist read).
     */
    has_stored_tracklist?: boolean;
    /**
     * HasWaveform is true when a waveform is stored for this recording.
     */
    has_waveform?: boolean;
    /**
     * Loudness is the EBU R128 summary; null when none stored.
     */
    loudness?: RecordingLoudnessSummary;
    /**
     * MediaUploadID is the media-ingest upload backing the hosted audio
     * (`upl_<uuid>`); null when no audio is attached.
     */
    media_upload_id?: string;
    /**
     * PerformerID is the performer identity the set was performed as
     * (`perf_<uuid>`); null when none.
     */
    performer_id?: string;
    /**
     * RecordingID is the recording (= live stream) id (`strm_<uuid>`).
     */
    recording_id?: string;
    /**
     * Releases are the releases linked to this recording. Never null
     * (empty slice when none linked).
     */
    releases?: Array<RecordingReleaseRef>;
    /**
     * RightsConfirmedAt is when the uploader affirmed they hold the
     * rights to host this recording (RFC3339 UTC); null for sets
     * created before the affirmation existed.
     */
    rights_confirmed_at?: string;
    /**
     * StartedAt is the set start timestamp (RFC3339 UTC).
     */
    started_at?: string;
    /**
     * Title is the DJ-set title; null when unset.
     */
    title?: string;
    /**
     * TrackCount is the number of plays banked for this recording's set.
     */
    track_count?: number;
    /**
     * Visibility is the recording's read-audience policy.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

