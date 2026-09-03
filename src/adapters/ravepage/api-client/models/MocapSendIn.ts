/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MocapSendIn = {
    /**
     * PayloadB64 is the opaque payload, standard base64, ≤256KiB
     * decoded.
     */
    payload_b64?: string;
    /**
     * Seq is a sender-chosen sequence number, passed through
     * verbatim.
     */
    seq?: number;
    /**
     * SID is the SENDER session id (must belong to the caller).
     */
    sid?: string;
    /**
     * ToSID is the directed target session id. Omit for a room
     * broadcast - masters only (nodes get 403
     * NODE_BROADCAST_FORBIDDEN).
     */
    to_sid?: string;
};

