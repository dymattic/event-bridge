/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InitiateUploadRequest = {
    /**
     * Description is an optional longer-form text describing the
     * media.
     */
    description?: string;
    /**
     * FileHash is the SHA-256 hex-digest of the COMPLETE file (not a
     * chunk). Used for resume detection: when (file_hash, user_id)
     * matches an existing in-flight upload, the server returns its
     * upload_id + the list of chunks already received.
     */
    file_hash?: string;
    /**
     * FileSize is the exact total byte size of the file. Server uses
     * it with chunk_size to derive total_chunks.
     */
    file_size?: number;
    /**
     * MimeType is the IANA media type (e.g. "video/mp4"). Stored on
     * the upload row; influences post-upload pipeline routing.
     */
    mime_type?: string;
    /**
     * OriginalFilename is the filename as supplied by the user. Stored
     * for display; the server derives a sanitized_filename for S3.
     */
    original_filename?: string;
    /**
     * Tags is an optional list of keywords.
     */
    tags?: Array<string>;
    /**
     * Title is an optional user-supplied display title. Falls back to
     * OriginalFilename in UI rendering.
     */
    title?: string;
    /**
     * UploadTarget is one of "youtube", "soundcloud", "both", or
     * absent. Hints at intended downstream syndication.
     */
    upload_target?: string;
};

