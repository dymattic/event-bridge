/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TwitchLiveProbeIn = {
    /**
     * BroadcasterID - Twitch numeric user_id from the OAuth-link's
     * provider_id field. REQUIRED.
     */
    broadcaster_id?: string;
    /**
     * CallerTraceID - request-scoped trace id for observability.
     */
    caller_trace_id?: string;
    /**
     * TwitchLogin - fallback login name (provider_username). Surfaced
     * in the response when Helix returns no live stream .
     */
    twitch_login?: string;
};

