/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChunkUploadNativeResponse = {
    /**
     * ChecksumCalculated is the SHA-256 hex the server computed over
     * the received bytes.
     */
    checksum_calculated?: string;
    /**
     * ChecksumProvided is the SHA-256 hex the client supplied via the
     * X-Chunk-Checksum header.
     */
    checksum_provided?: string;
    chunk_number?: number;
    /**
     * Status is the per-call outcome:
     * - "ok" - chunk accepted, checksum verified.
     * - "checksum_mismatch" - server-computed SHA-256 differs from
     * the X-Chunk-Checksum header. Client
     * should retry with corrected bytes.
     * - "already_uploaded" - idempotent re-send of a chunk that
     * was already accepted.
     */
    status?: 'ok' | 'checksum_mismatch' | 'already_uploaded';
    /**
     * TotalChunks is the unchanged total derived at initiate time.
     */
    total_chunks?: number;
    upload_id?: string;
    /**
     * UploadedChunkNumbers is the cumulative list of accepted chunk
     * indices (sorted ascending).
     */
    uploaded_chunk_numbers?: Array<number>;
};

