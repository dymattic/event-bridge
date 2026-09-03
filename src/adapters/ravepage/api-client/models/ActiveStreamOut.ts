/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ActiveStreamOut = {
    /**
     * LastSeenAt is the row's `last_seen_at` timestamp - the most
     * recent heartbeat from the ingest fan-in. Never null on the wire .
     */
    last_seen_at?: string;
    /**
     * Source is the optional ingest-source key .
     */
    source?: string;
    /**
     * StartedAt is the row's `started_at` timestamp - when the DJ
     * began the active session.
     */
    started_at?: string;
    stream_id?: string;
    /**
     * Title is the optional session title .
     * Pointer so JSON `null` rides the wire when the column is NULL.
     */
    title?: string;
    /**
     * The echo is load-bearing for the FE: a
     * profile page that issued the probe gets the user_id back so it
     * can correlate the response with the page it's rendering.
     */
    user_id?: string;
};

