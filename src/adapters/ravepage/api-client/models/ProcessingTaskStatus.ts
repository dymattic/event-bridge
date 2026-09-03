/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProcessingTaskStatus = {
    /**
     * CreatedAt is the ISO-8601 timestamp of upload creation.
     */
    created_at?: string;
    /**
     * ErrorMessage is the upload's error_message column (NULL → null).
     */
    error_message?: string;
    /**
     * EstimatedCompletion is the ETA timestamp.
     */
    estimated_completion?: string;
    /**
     * FilePath is the s3:// or local path of the resulting file. NULL
     * until the pipeline writes it.
     */
    file_path?: string;
    /**
     * FileSize is the byte count of the resulting file. NULL until
     * upload completes.
     */
    file_size?: number;
    /**
     * IsAudioOnly distinguishes audio uploads from video for the
     * FE's player selection .
     */
    is_audio_only?: boolean;
    /**
     * MimeType is the content-type as detected at upload time.
     */
    mime_type?: string;
    /**
     * OperationParameters is the kwargs payload for the operation.
     * Always nil in the Go port - see package doc.
     */
    operation_parameters?: Record<string, any>;
    /**
     * OperationType is the media-processing operation that produced
     * this row (cut / convert / extract_audio / compress). Always nil
     * in the Go port - see package doc.
     */
    operation_type?: string;
    /**
     * OriginalFilename is the as-uploaded filename.
     */
    original_filename?: string;
    /**
     * Progress is a 0.0-100.0 percentage computed from Status. Nil
     * when Status isn't one of the mapped values.
     */
    progress?: number;
    /**
     * Status is the upload's lifecycle: pending / uploading / uploaded
     * / processing / completed / processed / failed / cancelled.
     */
    status?: 'pending' | 'uploading' | 'uploaded' | 'processing' | 'completed' | 'processed' | 'failed' | 'cancelled';
    task_id?: string;
    /**
     * Title is the user-supplied title (NULL when unset).
     */
    title?: string;
    /**
     * UpdatedAt is the ISO-8601 timestamp of last update.
     */
    updated_at?: string;
};

