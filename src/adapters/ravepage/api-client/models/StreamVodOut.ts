/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StreamVodOut = {
    /**
     * CfVideoUID is the opaque Cloudflare Stream video UID.
     */
    cf_video_uid?: string;
    /**
     * CreatedAt / UpdatedAt are non-null ORM timestamps.
     */
    created_at?: string;
    /**
     * DurationSeconds is the playback duration .
     */
    duration_seconds?: number;
    id?: string;
    /**
     * LiveInputID is `cfli_<uuid>` or null.
     */
    live_input_id?: string;
    /**
     * Name is the human-readable title .
     */
    name?: string;
    /**
     * PerformerID is `perf_<uuid>` or null.
     */
    performer_id?: string;
    playback_dash?: string;
    /**
     * PlaybackHLS / PlaybackDASH / ThumbnailURL are nullable URLs.
     */
    playback_hls?: string;
    /**
     * State is the processing state (queued / inprogress / ready /
     * error / not-found).
     */
    state?: string;
    thumbnail_url?: string;
    updated_at?: string;
    /**
     * UserID is `usr_<uuid>` - owning user. Echoed back to the wire
     * even on user-scoped responses so the FE can correlate.
     */
    user_id?: string;
};

