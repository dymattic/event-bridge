/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminMediaPipelineAttachmentOut } from './AdminMediaPipelineAttachmentOut';
import type { PipelineStatus } from './PipelineStatus';
export type AdminMediaPipelineItemOut = {
    /**
     * Attachments lists every surface that references this upload.
     * Worker always emits `[]` - documented parity gap pending
     * cross-worker contracts.
     */
    attachments?: Array<AdminMediaPipelineAttachmentOut>;
    /**
     * AVScannedAt is the timestamp of the most recent AV scan
     * (null when the AV scan has not yet run).
     */
    av_scanned_at?: string;
    /**
     * AVSignature is the ClamAV signature name when
     * `pipeline_status == "quarantined"`.
     */
    av_signature?: string;
    /**
     * CreatedAt is when the upload row was inserted.
     */
    created_at?: string;
    /**
     * FilePath is the S3 URI or local-disk path - debug aid.
     */
    file_path?: string;
    /**
     * FileSize is the upload size in bytes.
     */
    file_size?: number;
    /**
     * ID is the prefixed upload id (`upl_<uuid>`).
     */
    id?: string;
    /**
     * MimeType is the upload's content type.
     */
    mime_type?: string;
    /**
     * PipelineError is the human-readable failure reason (admin-only
     * surface - the public stream endpoint hides this).
     */
    pipeline_error?: string;
    /**
     * PipelineStatus is the post-upload pipeline state. Named enum so
     * the FE generator emits a typed union.
     */
    pipeline_status?: PipelineStatus;
    /**
     * Status is the chunked-upload lifecycle state.
     */
    status?: 'pending' | 'uploading' | 'uploaded' | 'processing' | 'completed' | 'processed' | 'failed' | 'cancelled';
    /**
     * StreamURL is the path the admin can paste into a browser to
     * fetch the file directly. id)` - `/media/stream/{id}`.
     */
    stream_url?: string;
    /**
     * UpdatedAt is the most recent mutation timestamp.
     */
    updated_at?: string;
    /**
     * UserID is the prefixed uploader user id (`usr_<uuid>`), or null
     * for unowned uploads.
     */
    user_id?: string;
};

