/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BridgeSessionOut } from './BridgeSessionOut';
export type BridgeSessionRegisterOut = {
    /**
     * HeartbeatSeconds is the advisory heartbeat interval.
     */
    heartbeat_seconds?: number;
    /**
     * Session is the registered session.
     */
    session?: BridgeSessionOut;
    /**
     * TTLSeconds is the presence lifetime without refresh.
     */
    ttl_seconds?: number;
};

