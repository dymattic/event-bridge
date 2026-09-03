/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventReportResolveIn = {
    /**
     * ResolutionNote is the optional resolution body.
     */
    resolution_note?: string;
    /**
     * Status is the new report state. status` column is documented at
     * `pending | reviewing | resolved | dismissed` - the resolve
     * endpoint only ever transitions to a TERMINAL state).
     */
    status?: 'resolved' | 'dismissed';
};

