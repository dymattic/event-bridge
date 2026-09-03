/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MaintenanceWindowID } from './MaintenanceWindowID';
import type { UserID } from './UserID';
export type AdminMaintenanceDetailOut = {
    actual_end?: string;
    actual_start?: string;
    affected_services?: Array<string>;
    created_at?: string;
    created_by?: UserID;
    description?: string;
    id?: MaintenanceWindowID;
    scheduled_end?: string;
    scheduled_start?: string;
    status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    title?: string;
    updated_at?: string;
};

