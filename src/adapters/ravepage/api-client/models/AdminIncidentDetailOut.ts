/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminIncidentUpdateOut } from './AdminIncidentUpdateOut';
import type { IncidentID } from './IncidentID';
import type { UserID } from './UserID';
export type AdminIncidentDetailOut = {
    affected_services?: Array<string>;
    created_at?: string;
    created_by?: UserID;
    description?: string;
    id?: IncidentID;
    impact?: 'minor' | 'major' | 'critical';
    resolved_at?: string;
    started_at?: string;
    status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    title?: string;
    updated_at?: string;
    updates?: Array<AdminIncidentUpdateOut>;
};

