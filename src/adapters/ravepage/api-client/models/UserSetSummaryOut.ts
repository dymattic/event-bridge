/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserSetSummaryOut = {
    /**
     * EventID is the event the set was attached to (`evt_<uuid>`), null
     * when the set wasn't tied to an event.
     */
    event_id?: string;
    /**
     * FirstPlayedAt is the RFC3339 UTC time of the earliest play in the
     * set.
     */
    first_played_at?: string;
    /**
     * LastPlayedAt is the RFC3339 UTC time of the latest play in the set.
     */
    last_played_at?: string;
    /**
     * StreamID is the set's live stream (`strm_<uuid>`).
     */
    stream_id?: string;
    /**
     * TrackCount is the number of plays banked for the set.
     */
    track_count?: number;
};

