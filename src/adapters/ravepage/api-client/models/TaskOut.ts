/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaskOut = {
    /**
     * Message is the human-readable confirmation.
     */
    message?: string;
    /**
     * Status is the initial task lifecycle state - `queued` on
     * fresh submit, `restarted` on a re-queue.
     */
    status?: 'queued' | 'restarted';
    /**
     * TaskID is the queued task identifier. Matches the
     * media-upload-id and can be used to poll status.
     */
    task_id?: string;
};

