/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BackgroundOut = {
    /**
     * FileSize - stored upload size in bytes; nil if unset.
     */
    file_size?: number;
    /**
     * Kind - "image" or "video".
     */
    kind?: 'image' | 'video';
    /**
     * MediaUploadID - UUID of the assigned upload.
     */
    media_upload_id?: string;
    /**
     * MimeType - stored upload mime; nil if unset.
     */
    mime_type?: string;
    /**
     * URL - stream URL for the upload.
     */
    url?: string;
};

