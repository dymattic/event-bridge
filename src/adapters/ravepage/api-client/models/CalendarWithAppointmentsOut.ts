/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentOut } from './AppointmentOut';
export type CalendarWithAppointmentsOut = {
    appointments?: Array<AppointmentOut>;
    created_at?: string;
    description?: string;
    entity_id?: string;
    entity_type?: string;
    id?: string;
    is_public?: boolean;
    name?: string;
    requires_approval?: boolean;
    synced_google_calendar_ids?: Array<string>;
    updated_at?: string;
};

