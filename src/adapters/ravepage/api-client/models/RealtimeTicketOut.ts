/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RealtimeTicketOut = {
    /**
     * ExpiresAt is the absolute expiry, RFC3339.
     */
    expires_at?: string;
    /**
     * ExpiresInSeconds is the same expiry as a duration, for clients
     * that would otherwise have to trust their own clock.
     */
    expires_in_seconds?: number;
    /**
     * IPBinding states what the ticket is actually bound to, which is
     * not always what was asked for:
     *
     * strict bound to this caller's address (the default)
     * relaxed no address binding; the caller asked for this after a
     * dual-stack flip, and the TTL was shortened to match
     * network bound to the anonymity network the request arrived on
     *
     * `network` is the honest answer over the Tor onion service: every
     * caller there presents the tor daemon's address, so the commitment
     * still blocks redeeming the ticket from the clearnet vhost but
     * does NOT distinguish one onion user from another. The remaining
     * protections are unchanged - sealed, single-use, scope-bound, and
     * expiring in seconds. Stated rather than implied, because a client
     * that believes it holds a caller-bound credential and does not is
     * exactly the kind of thing nobody discovers until it matters.
     */
    ip_binding?: string;
    /**
     * QueryParam names the stream-URL parameter to put Ticket in.
     * Hardcoding "ticket" client-side is fine; this exists so the
     * parameter can be renamed without a client release.
     */
    query_param?: string;
    /**
     * Scope echoes the granted scope.
     */
    scope?: string;
    /**
     * SingleUse is always true. Present so a client can assert it and
     * fail loudly if the contract ever changes.
     */
    single_use?: boolean;
    /**
     * Ticket is the opaque value to append to the stream URL.
     */
    ticket?: string;
};

