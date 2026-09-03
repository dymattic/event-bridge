/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlayReportIn = {
    /**
     * DurationMS is the track duration as the player saw it. Optional:
     * omit (or 0) and only the absolute >=30s rule applies.
     */
    duration_ms?: number;
    /**
     * PlayedAt is when the play finished (RFC3339). Optional - defaults
     * to server now. Accepted within [now-6h, now+2m]; anything outside
     * is clamped to now (offline queues replay late; clocks drift).
     */
    played_at?: string;
    /**
     * PlayedMS is how much audio actually played, in milliseconds
     * (elapsed listening, NOT the seek position). The qualification
     * evidence: the server accepts the play only when PlayedMS >= 30000
     * or >= 50% of DurationMS.
     */
    played_ms?: number;
    /**
     * SessionID is the client's opaque listening-session id (stable for
     * one player session, e.g. one tab). REQUIRED: it is the hard
     * idempotency key - re-reporting the same track in the same session
     * is absorbed, never duplicated. Max 64 chars.
     */
    session_id?: string;
    /**
     * TrackID is the canonical track that was played (bare UUID or the
     * prefixed `trk_<uuid>` wire form).
     */
    track_id?: string;
};

