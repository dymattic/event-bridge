/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IncidentID } from './IncidentID';
import type { IncidentUpdateID } from './IncidentUpdateID';
import type { UserID } from './UserID';
export type AdminIncidentUpdateOut = {
    created_at?: string;
    created_by?: UserID;
    id?: IncidentUpdateID;
    incident_id?: IncidentID;
    message?: string;
    status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
};

