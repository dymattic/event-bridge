/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PublicIncidentUpdateOut = {
    /**
     * CreatedAt is when this timeline entry was posted.
     */
    created_at?: string;
    /**
     * Message is the operator-written public-facing prose.
     */
    message?: string;
    /**
     * Status is one of: investigating | identified | monitoring | resolved.
     */
    status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
};

