/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatFileVersionOut = {
    /**
     * Creation timestamp.
     */
    created_at?: string;
    /**
     * Delta descriptor.
     */
    delta?: Record<string, any>;
    /**
     * File descriptor (url, md5, sizeInBytes, status).
     */
    file?: Record<string, any>;
    /**
     * Signature descriptor.
     */
    signature?: Record<string, any>;
    /**
     * Version status.
     */
    status?: 'none' | 'waiting' | 'queued' | 'complete' | 'error';
    /**
     * Version number.
     */
    version?: number;
};

