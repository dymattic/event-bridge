/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BridgeSessionRegisterIn = {
    /**
     * Capabilities advertises what the session can serve (≤16 entries,
     * each ≤64 chars), e.g. "bridge.localStudio", "peerlink.wan".
     */
    capabilities?: Array<string>;
    /**
     * DisplayName is the human label shown in device pickers (≤128 chars).
     */
    display_name?: string;
    /**
     * NodeID is the client-chosen stable instance/node id (1-128 chars).
     */
    node_id?: string;
};

