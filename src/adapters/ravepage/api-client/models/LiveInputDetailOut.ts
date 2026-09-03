/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LiveInputDetailOut = {
    cf_live_input_uid?: string;
    created_at?: string;
    current_video_uid?: string;
    enabled?: boolean;
    /**
     * `cfli_<uuid>`
     */
    id?: string;
    is_live?: boolean;
    last_seen_live_at?: string;
    last_status_check_at?: string;
    name?: string;
    /**
     * `perf_<uuid>` or null
     */
    performer_id?: string;
    prefer_low_latency?: boolean;
    recording_mode?: string;
    /**
     * decrypted; null on legacy
     */
    rtmps_stream_key?: string;
    rtmps_url?: string;
    /**
     * decrypted; null on legacy
     */
    srt_passphrase?: string;
    srt_stream_id?: string;
    srt_url?: string;
    status?: 'connected' | 'disconnected' | 'errored' | 'idle';
    updated_at?: string;
    /**
     * `usr_<uuid>`
     */
    user_id?: string;
};

