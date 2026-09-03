/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PerformerSetSummaryOut = {
    /**
     * EndedAt is the RFC3339 UTC time the set ended.
     */
    ended_at?: string;
    /**
     * EventID is the event the set was attached to (`evt_<uuid>`), null
     * when unattached.
     */
    event_id?: string;
    /**
     * StartedAt is the RFC3339 UTC time the set started.
     */
    started_at?: string;
    /**
     * StreamID is the set's live stream (`strm_<uuid>`).
     */
    stream_id?: string;
    /**
     * TrackCount is the number of plays banked for the set.
     */
    track_count?: number;
};

