/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BridgeSessionOut = {
    /**
     * Capabilities as advertised at registration.
     */
    capabilities?: Array<string>;
    /**
     * ConnectedAt is the registration time (RFC3339).
     */
    connected_at?: string;
    /**
     * DisplayName is the human label.
     */
    display_name?: string;
    /**
     * NodeID is the client-chosen instance/node id.
     */
    node_id?: string;
    /**
     * SID is the ephemeral session id ("bses_<32hex>").
     */
    sid?: string;
};

