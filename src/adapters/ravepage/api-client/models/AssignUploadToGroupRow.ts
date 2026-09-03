/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AssignUploadToGroupRow = {
    /**
     * GroupID - bare UUID string of the new owning group. Always
     * equals the request's group_id when ok=true.
     */
    group_id?: string;
    /**
     * ID - bare UUID string of the updated upload.
     */
    id?: string;
    /**
     * Status - `media_uploads.status` .
     */
    status?: 'pending' | 'uploading' | 'uploaded' | 'analyzing' | 'analyzed' | 'converting' | 'converted' | 'processing' | 'processed' | 'completed' | 'failed' | 'broken' | 'cancelled' | 'queued' | 'restarted' | 'started' | 'cleaned';
};

