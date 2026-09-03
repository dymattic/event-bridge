/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminIncidentUpdateIn = {
    /**
     * Message is the operator-written, public-facing prose. 1..2000
     * chars.
     */
    message?: string;
    /**
     * Status is the incident's target status after this entry lands.
     */
    status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
};

