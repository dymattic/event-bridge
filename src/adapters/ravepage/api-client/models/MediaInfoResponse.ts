/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MediaInfoResponse = {
    /**
     * CreatedAt is the upload-row creation timestamp.
     */
    created_at?: string;
    /**
     * Duration is the media length in seconds; null for non-time-based
     * media or pre-analysis.
     */
    duration?: number;
    /**
     * FileSize is the byte size.
     */
    file_size?: number;
    /**
     * HasPreview indicates a low-res editing preview blob is ready.
     */
    has_preview?: boolean;
    /**
     * ID is the raw upload UUID .
     */
    id?: string;
    /**
     * IsAudioOnly indicates the media contains only audio.
     */
    is_audio_only?: boolean;
    /**
     * IsVideo indicates the media contains a video stream.
     */
    is_video?: boolean;
    /**
     * MimeType is the standard media type (e.g. `video/mp4`).
     */
    mime_type?: string;
    /**
     * OriginalFilename is the upload-time filename as supplied by the
     * user.
     */
    original_filename?: string;
    /**
     * SanitizedFilename is the storage-safe filename used internally.
     */
    sanitized_filename?: string;
    /**
     * Status is the chunked-upload lifecycle state.
     */
    status?: 'pending' | 'uploading' | 'uploaded' | 'analyzing' | 'analyzed' | 'converting' | 'converted' | 'processing' | 'processed' | 'completed' | 'failed' | 'broken' | 'cancelled' | 'queued' | 'restarted' | 'started' | 'cleaned';
    /**
     * Title is the user-set display title; null when unset (the FE
     * falls back to OriginalFilename).
     */
    title?: string;
    /**
     * UpdatedAt is the last metadata-update timestamp.
     */
    updated_at?: string;
};

