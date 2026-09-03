/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MocapSessionOut } from './MocapSessionOut';
export type MocapJoinOut = {
    /**
     * HeartbeatSeconds is the advisory heartbeat interval.
     */
    heartbeat_s?: number;
    /**
     * Members are the room's live sessions (including this one),
     * oldest first.
     */
    members?: Array<MocapSessionOut>;
    /**
     * SessionTTLSeconds is presence lifetime without refresh.
     */
    session_ttl_s?: number;
    /**
     * SID is the minted session id.
     */
    sid?: string;
};

