/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PerformerClaimUpdateIn = {
    /**
     * AdminNotes is the optional resolution note.
     */
    admin_notes?: string;
    /**
     * Status is the new claim status. Required; one of
     * `approved|rejected|disputed`.
     */
    status?: 'approved' | 'rejected' | 'disputed';
};

