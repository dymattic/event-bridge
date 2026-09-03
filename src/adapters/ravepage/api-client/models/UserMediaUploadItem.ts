/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserMediaUploadItem = {
    audio_bitrate?: number;
    chunk_size?: number;
    created_at?: string;
    description?: string;
    duration?: number;
    error_message?: string;
    file_checksum?: string;
    file_size?: number;
    id?: string;
    is_audio_only?: boolean;
    is_lossy?: boolean;
    is_public?: boolean;
    mime_type?: string;
    original_filename?: string;
    parent_upload_id?: string;
    pipeline_error?: string;
    pipeline_status?: string;
    preview_file_path?: string;
    preview_s3_exists?: boolean;
    s3_exists?: boolean;
    sanitized_filename?: string;
    soundcloud_track_id?: string;
    status?: 'pending' | 'uploading' | 'uploaded' | 'processing' | 'completed' | 'processed' | 'failed' | 'cancelled';
    tags?: Array<string>;
    title?: string;
    total_chunks?: number;
    updated_at?: string;
    upload_target?: string;
    uploaded_chunks?: number;
    video_bitrate?: number;
    youtube_video_id?: string;
};

