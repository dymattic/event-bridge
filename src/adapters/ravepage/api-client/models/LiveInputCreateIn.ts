/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LiveInputRecordingIn } from './LiveInputRecordingIn';
export type LiveInputCreateIn = {
    /**
     * DeleteRecordingAfterDays optionally bounds retention (30..1096).
     */
    delete_recording_after_days?: number;
    /**
     * Name is the human-readable name (1..255).
     */
    name?: string;
    /**
     * PerformerID is bare UUID or `perf_<uuid>` (optional).
     */
    performer_id?: string;
    /**
     * PreferLowLatency toggles LL-HLS. Default true.
     */
    prefer_low_latency?: boolean;
    /**
     * Recording is the recording sub-settings (defaults applied).
     */
    recording?: LiveInputRecordingIn;
    /**
     * TimeoutSeconds is the disconnect timeout (>= 0). Default 0.
     */
    timeout_seconds?: number;
};

