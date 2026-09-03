/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InitiateUploadResponse = {
    /**
     * ChunkSize is the expected byte size for every chunk except
     * possibly the last. UPLOAD_CHUNK_SIZE`.
     */
    chunk_size?: number;
    /**
     * Status is the upload's lifecycle state at the moment of
     * response: "uploading" for new/in-progress, "uploaded" if
     * resuming a fully-received session, "completed" for one that
     * already finalised.
     */
    status?: 'uploading' | 'uploaded' | 'completed';
    /**
     * TotalChunks is the number of chunks the client must upload.
     * Derived as `ceil(file_size / chunk_size)`.
     */
    total_chunks?: number;
    /**
     * UploadID is the `upl_<uuid>` prefixed wire form of the session
     * identifier.
     */
    upload_id?: string;
    /**
     * UploadedChunkNumbers lists zero-based indices of chunks the
     * server has already accepted. Empty `[]` on a fresh session;
     * populated on resume.
     */
    uploaded_chunk_numbers?: Array<number>;
};

