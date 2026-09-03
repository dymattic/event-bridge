/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type groupUploadListItem = {
    created_at?: string;
    file_size?: number;
    id?: string;
    is_public?: boolean;
    mime_type?: string;
    original_filename?: string;
    status?: 'pending' | 'uploading' | 'uploaded' | 'analyzing' | 'analyzed' | 'converting' | 'converted' | 'processing' | 'processed' | 'completed' | 'failed' | 'broken' | 'cancelled' | 'queued' | 'restarted' | 'started' | 'cleaned';
    title?: string;
};

