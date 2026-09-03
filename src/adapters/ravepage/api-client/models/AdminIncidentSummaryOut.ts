/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IncidentID } from './IncidentID';
export type AdminIncidentSummaryOut = {
    affected_services?: Array<string>;
    id?: IncidentID;
    impact?: 'minor' | 'major' | 'critical';
    resolved_at?: string;
    started_at?: string;
    status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    title?: string;
    updated_at?: string;
};

