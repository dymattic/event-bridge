/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BridgeSendIn = {
    /**
     * Kind is the frame class. "signal" = handshake/offer/answer;
     * "relay" = data plane (requires both-sides accept).
     */
    kind?: 'signal' | 'relay';
    /**
     * PayloadB64 is the opaque payload, standard base64, ≤256KiB decoded.
     */
    payload_b64?: string;
    /**
     * Seq is a sender-chosen sequence number, passed through verbatim.
     */
    seq?: number;
    /**
     * SID is the SENDER session id (must belong to the caller).
     */
    sid?: string;
    /**
     * ToSID is the target session id (same account).
     */
    to_sid?: string;
};

