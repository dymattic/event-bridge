/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MediaUploadResponse = {
    audio_bitrate?: number;
    chunk_size?: number;
    /**
     * Timestamps --------------------------------------------------
     */
    created_at?: string;
    description?: string;
    /**
     * Media analysis (populated by post-upload pipeline) ---------
     */
    duration?: number;
    error_message?: string;
    file_checksum?: string;
    /**
     * Bytes-on-the-wire metadata ----------------------------------
     */
    file_size?: number;
    /**
     * Identity / ownership ----------------------------------------
     */
    id?: string;
    is_audio_only?: boolean;
    is_lossy?: boolean;
    is_public?: boolean;
    mime_type?: string;
    original_filename?: string;
    /**
     * prefixed wire form when present
     */
    parent_upload_id?: string;
    pipeline_error?: string;
    pipeline_status?: string;
    sanitized_filename?: string;
    soundcloud_track_id?: string;
    /**
     * Lifecycle ---------------------------------------------------
     */
    status?: 'pending' | 'uploading' | 'uploaded' | 'processing' | 'completed' | 'processed' | 'failed' | 'cancelled';
    tags?: Array<string>;
    /**
     * User-supplied metadata --------------------------------------
     */
    title?: string;
    /**
     * Chunked-upload tracking -------------------------------------
     */
    total_chunks?: number;
    updated_at?: string;
    upload_target?: string;
    uploaded_chunks?: number;
    video_bitrate?: number;
    /**
     * External platform identifiers -------------------------------
     */
    youtube_video_id?: string;
};

