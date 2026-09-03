/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StreamHealth } from './StreamHealth';
export type NatsHealth = {
    detail?: string;
    latency_ms?: number;
    status?: 'ok' | 'degraded' | 'down' | 'unknown' | 'disabled';
    streams?: Array<StreamHealth>;
};

