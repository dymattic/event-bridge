/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UploadStatusFilter = {
    /**
     * Value is the upload-status filter; one of the lifecycle states
     * below. Empty string = no filter.
     */
    value?: 'pending' | 'uploading' | 'uploaded' | 'analyzing' | 'analyzed' | 'converting' | 'converted' | 'processing' | 'processed' | 'completed' | 'failed' | 'broken' | 'cancelled' | 'queued' | 'restarted' | 'started' | 'cleaned';
};

