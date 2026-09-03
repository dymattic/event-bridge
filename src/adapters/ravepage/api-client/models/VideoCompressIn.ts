/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VideoCompressIn = {
    /**
     * Quality is the bias when TargetSizeMB is absent - `low` /
     * `medium` / `high`. Default `medium`.
     */
    quality?: 'low' | 'medium' | 'high';
    /**
     * TargetSizeMB is the optional target file size in megabytes.
     * When set, the encoder adjusts bitrates to hit this target.
     */
    target_size_mb?: number;
    /**
     * UploadID is the source media-upload identifier. Required.
     */
    upload_id?: string;
};

