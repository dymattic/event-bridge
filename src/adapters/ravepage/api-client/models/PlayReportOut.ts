/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlayReportOut = {
    /**
     * DedupeWindowSeconds is the server's replay window for the same
     * (user, track) - a second play inside it is absorbed. Informational
     * so the client can self-throttle.
     */
    dedupe_window_seconds?: number;
    /**
     * Deduped is true when the play was recognized as already-logged
     * (same session, or the same track inside the dedupe window) and
     * silently absorbed. Recorded=false, Deduped=true is a SUCCESS - the
     * client must not retry.
     */
    deduped?: boolean;
    /**
     * Recorded is true when a NEW play row landed.
     */
    recorded?: boolean;
};

