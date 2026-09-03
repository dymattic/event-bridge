/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkerSubjectHealth = {
    actual_lag_seconds?: number;
    cadence_seconds?: number;
    expected_max_lag_seconds?: number;
    last_emitted_at?: string;
    nats_ack_pending?: number;
    nats_pending?: number;
    status?: 'ok' | 'degraded' | 'down' | 'unknown' | 'disabled';
    subject?: string;
};

