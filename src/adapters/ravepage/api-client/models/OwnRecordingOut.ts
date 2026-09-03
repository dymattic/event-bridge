/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OwnRecordingOut = {
    /**
     * AudioReady is true when hosted audio is attached and playable.
     */
    audio_ready?: boolean;
    /**
     * EndedAt is the set end (RFC3339 UTC); null while open.
     */
    ended_at?: string;
    /**
     * EventID is the event association (`evt_<uuid>`); null when
     * unattached.
     */
    event_id?: string;
    /**
     * HasTracklist is true when a stored (uploaded) tracklist is linked.
     */
    has_tracklist?: boolean;
    /**
     * HasWaveform is true when a waveform is stored.
     */
    has_waveform?: boolean;
    /**
     * PerformerID is the performer identity (`perf_<uuid>`); null when
     * none.
     */
    performer_id?: string;
    /**
     * RecordingID is the recording (`strm_<uuid>`).
     */
    recording_id?: string;
    /**
     * Source is how the set was produced (`recorded`, or the reporting
     * DJ software for live-ingested sets); null when unknown.
     */
    source?: string;
    /**
     * StartedAt is the set start (RFC3339 UTC).
     */
    started_at?: string;
    /**
     * Title is the set title; null when unset.
     */
    title?: string;
    /**
     * TrackCount is the number of play-log rows banked for the set (0
     * for a purely uploaded set).
     */
    track_count?: number;
    /**
     * Visibility is the read-audience policy.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

