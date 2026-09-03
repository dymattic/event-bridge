/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MaintenanceWindowID } from './MaintenanceWindowID';
export type PublicMaintenanceOut = {
    /**
     * ActualEnd is when the window actually ended; nil while not ended.
     */
    actual_end?: string;
    /**
     * ActualStart is when the window actually began; nil while not started.
     */
    actual_start?: string;
    /**
     * AffectedServices is the list of public-service ids affected.
     */
    affected_services?: Array<string>;
    /**
     * Description is the operator-written public-facing prose.
     */
    description?: string;
    /**
     * ID is the prefixed maintenance-window identifier (mw_<uuid>).
     */
    id?: MaintenanceWindowID;
    /**
     * ScheduledEnd is the operator-set planned end.
     */
    scheduled_end?: string;
    /**
     * ScheduledStart is the operator-set planned start.
     */
    scheduled_start?: string;
    /**
     * Status is one of: scheduled | in_progress | completed | cancelled.
     */
    status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    /**
     * Title is the operator-facing headline.
     */
    title?: string;
};

