/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MocapSessionOut = {
    /**
     * JoinedAt is the join time (RFC3339).
     */
    joined_at?: string;
    /**
     * Label is the session label.
     */
    label?: string;
    /**
     * LastSeen is the last heartbeat/send time (RFC3339).
     */
    last_seen?: string;
    /**
     * Role is node|master.
     */
    role?: 'node' | 'master';
    /**
     * SID is the ephemeral session id ("mses_<16hex>").
     */
    sid?: string;
    /**
     * Tier is the informational rig tier ("" for editors without a
     * roster row).
     */
    tier?: string;
    /**
     * UserID is the session owner (prefixed).
     */
    user_id?: string;
};

