/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UploadStatusOut = {
    id?: string;
    /**
     * MissingChunks is the list of chunk numbers that still need to be
     * uploaded. Always a non-nil slice - an empty list serializes as
     * `[]`, never `null`.
     */
    missing_chunks?: Array<number>;
    /**
     * PipelineError is the failure reason when PipelineStatus ==
     * "failed"; nil → JSON `null` otherwise.
     */
    pipeline_error?: string;
    /**
     * PipelineStatus is the post-upload pipeline state: pending,
     * scanning, quarantined, optimizing, ready, failed. Default
     * "ready" for legacy rows pre-pipeline.
     */
    pipeline_status?: string;
    /**
     * Status is the chunked-upload lifecycle state: pending,
     * analyzing, converting, uploading, completed, failed.
     */
    status?: 'pending' | 'analyzing' | 'converting' | 'uploading' | 'completed' | 'failed';
    /**
     * TotalChunks is the expected count of chunks for the entire
     * upload.
     */
    total_chunks?: number;
    /**
     * UploadedChunkNumbers lists the 0-based indices of chunks the
     * server already holds, ascending. Never null - `[]` when none.
     * This is the resume list; `missing_chunks` cannot drive resume on
     * its own because it is also empty for a brand-new upload that has
     * received nothing. Same key + same semantics as the initiate
     * response, so a client can resume from either.
     */
    uploaded_chunk_numbers?: Array<number>;
    /**
     * UploadedChunks is the count of chunks successfully received.
     */
    uploaded_chunks?: number;
};

