/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RealtimeTicketIn = {
    /**
     * IPBinding is `strict` (default) or `relaxed`. Use `relaxed` ONLY
     * after a REALTIME_TICKET_IP_MISMATCH, which indicates the mint and
     * the stream connection took different address families.
     */
    ip_binding?: string;
    /**
     * LastEventID resumes a dropped stream. Sent here rather than in
     * the stream URL so the cursor never appears in a log line; the
     * gateway replays it upstream as the `Last-Event-ID` header.
     */
    last_event_id?: string;
    /**
     * Resource is the scope-local resource id. Required for
     * `tasks.console` (the task run id); ignored otherwise.
     */
    resource?: string;
    /**
     * Scope is the stream the ticket may open. Required.
     */
    scope?: string;
};

