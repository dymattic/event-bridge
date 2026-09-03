/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UploadProjection = {
    /**
     * FilePath - `media_uploads.file_path` (production-zone S3 key).
     * Empty for collections.
     */
    file_path?: string;
    /**
     * FileSize - `media_uploads.file_size` in bytes. Zero when
     * unknown / not applicable.
     */
    file_size?: number;
    /**
     * ID - bare UUID string of the resolved upload / collection.
     */
    id?: string;
    /**
     * MimeType - present for uploads, empty for collections.
     */
    mime_type?: string;
    /**
     * OwnerGroupID - `media_uploads.group_id`. Empty string when
     * null.
     */
    owner_group_id?: string;
    /**
     * OwnerUserID - `media_uploads.user_id` (or
     * `media_collections.owner_user_id`). Empty string when null.
     */
    owner_user_id?: string;
    /**
     * PipelineStatus - `media_uploads.pipeline_status` for uploads
     * (one of `pending` / `scanning` / `ready` / `blob_missing` /
     * `quarantined` / …). Empty for collections.
     */
    pipeline_status?: string;
};

