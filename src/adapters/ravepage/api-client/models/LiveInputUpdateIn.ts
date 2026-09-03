/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LiveInputRecordingIn } from './LiveInputRecordingIn';
export type LiveInputUpdateIn = {
    delete_recording_after_days?: number;
    enabled?: boolean;
    name?: string;
    prefer_low_latency?: boolean;
    recording?: LiveInputRecordingIn;
    timeout_seconds?: number;
};

