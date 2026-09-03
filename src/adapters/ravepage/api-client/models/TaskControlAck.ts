/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaskControlAck = {
    /**
     * "cancel" | "run"
     */
    action?: string;
    /**
     * always "accepted"
     */
    status?: string;
    /**
     * run_id (cancel) or job name (run)
     */
    target?: string;
};

