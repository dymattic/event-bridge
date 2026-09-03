/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminIncidentPatchIn = {
    affected_services?: Array<string>;
    description?: string;
    impact?: 'minor' | 'major' | 'critical';
    status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    title?: string;
};

