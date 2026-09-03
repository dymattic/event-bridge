/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventAppointmentOut = {
    /**
     * CalendarID - parent calendar (bare UUID).
     */
    calendar_id?: string;
    /**
     * CreatedAt - ISO-8601 UTC.
     */
    created_at?: string;
    /**
     * Description - optional.
     */
    description?: string;
    /**
     * EndTime - ISO-8601 UTC.
     */
    end_time?: string;
    /**
     * EventID - back-ref to event (typed prefix), nullable.
     */
    event_id?: string;
    /**
     * ID - appointment row id (bare UUID).
     */
    id?: string;
    /**
     * StartTime - ISO-8601 UTC.
     */
    start_time?: string;
    /**
     * Status - pending | approved | rejected | cancelled.
     */
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
    /**
     * Title - appointment title.
     */
    title?: string;
    /**
     * UpdatedAt - ISO-8601 UTC.
     */
    updated_at?: string;
    /**
     * UserID - owner of the appointment (typed prefix).
     */
    user_id?: string;
};

