/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentBulkCreateIn } from '../models/AppointmentBulkCreateIn';
import type { AppointmentCreateIn } from '../models/AppointmentCreateIn';
import type { AppointmentOut } from '../models/AppointmentOut';
import type { AppointmentStatusUpdateIn } from '../models/AppointmentStatusUpdateIn';
import type { AppointmentUpdateIn } from '../models/AppointmentUpdateIn';
import type { AvailabilityOut } from '../models/AvailabilityOut';
import type { CalendarCreateIn } from '../models/CalendarCreateIn';
import type { CalendarOut } from '../models/CalendarOut';
import type { CalendarUpdateIn } from '../models/CalendarUpdateIn';
import type { CalendarWithAppointmentsOut } from '../models/CalendarWithAppointmentsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CalendarsService {
    /**
     * List calendars
     * Authenticated, paginated list of calendars filtered
     * by entity_type / entity_id. Default sort is
     * created_at DESC.
     * @returns CalendarOut OK
     * @throws ApiError
     */
    public static listCalendars({
        entityType,
        entityId,
        skip,
        limit,
        sortField,
        sortOrder,
    }: {
        /**
         * Filter by entity_type (user/group/club/role/event)
         */
        entityType?: any,
        /**
         * Filter by entity_id (UUID)
         */
        entityId?: any,
        /**
         * Pagination offset (default 0)
         */
        skip?: any,
        /**
         * Pagination limit (default 100, max 200)
         */
        limit?: any,
        /**
         * Sort column (created_at / updated_at / name / entity_type)
         */
        sortField?: any,
        /**
         * asc or desc (default desc)
         */
        sortOrder?: any,
    }): CancelablePromise<Array<CalendarOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendars',
            query: {
                'entity_type': entityType,
                'entity_id': entityId,
                'skip': skip,
                'limit': limit,
                'sort_field': sortField,
                'sort_order': sortOrder,
            },
            errors: {
                401: `Authentication required`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a calendar
     * Create a new calendar bound to an entity (user /
     * group / club / role / event).
     * @returns CalendarOut Created
     * @throws ApiError
     */
    public static createCalendar({
        requestBody,
    }: {
        /**
         * Calendar payload
         */
        requestBody: CalendarCreateIn,
    }): CancelablePromise<CalendarOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/calendars',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorized`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List appointments
     * Paginated, filtered list of appointments. Filters:
     * calendar_id, user_id, event_id, status, start_from,
     * end_to. Default sort is start_time ASC.
     * @returns AppointmentOut OK
     * @throws ApiError
     */
    public static listAppointments({
        calendarId,
        userId,
        eventId,
        status,
        startFrom,
        endTo,
        skip,
        limit,
        sortField,
        sortOrder,
    }: {
        /**
         * Filter by calendar
         */
        calendarId?: any,
        /**
         * Filter by creator user
         */
        userId?: any,
        /**
         * Filter by linked event
         */
        eventId?: any,
        /**
         * Filter by appointment status
         */
        status?: any,
        /**
         * Earliest start_time (RFC3339)
         */
        startFrom?: any,
        /**
         * Latest start_time (RFC3339)
         */
        endTo?: any,
        /**
         * Pagination offset
         */
        skip?: any,
        /**
         * Pagination limit (max 200)
         */
        limit?: any,
        /**
         * Sort column allowlist (start_time/end_time/created_at/updated_at/status/title)
         */
        sortField?: any,
        /**
         * asc or desc
         */
        sortOrder?: any,
    }): CancelablePromise<Array<AppointmentOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendars/appointments',
            query: {
                'calendar_id': calendarId,
                'user_id': userId,
                'event_id': eventId,
                'status': status,
                'start_from': startFrom,
                'end_to': endTo,
                'skip': skip,
                'limit': limit,
                'sort_field': sortField,
                'sort_order': sortOrder,
            },
            errors: {
                401: `Authentication required`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create an appointment
     * Inserts an appointment into a calendar. The caller
     * must be able to access the calendar; public
     * calendars accept any authed caller.
     * @returns AppointmentOut Created
     * @throws ApiError
     */
    public static createAppointment({
        requestBody,
    }: {
        /**
         * Appointment payload
         */
        requestBody: AppointmentCreateIn,
    }): CancelablePromise<AppointmentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/calendars/appointments',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorized`,
                404: `Calendar not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Bulk create appointments
     * Creates multiple appointments in one call. All
     * appointments must share the same calendar_id;
     * mismatched calendar_ids return 400.
     * @returns AppointmentOut Created
     * @throws ApiError
     */
    public static createAppointmentsBulk({
        requestBody,
    }: {
        /**
         * Bulk payload
         */
        requestBody: AppointmentBulkCreateIn,
    }): CancelablePromise<Array<AppointmentOut>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/calendars/appointments/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body / mismatched calendars`,
                401: `Authentication required`,
                403: `Not authorized`,
                404: `Calendar not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete an appointment
     * Removes the appointment.
     * @returns void
     * @throws ApiError
     */
    public static deleteAppointment({
        appointmentId,
    }: {
        /**
         * Appointment ID
         */
        appointmentId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/calendars/appointments/{appointment_id}',
            path: {
                'appointment_id': appointmentId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not authorized`,
                404: `Appointment not found`,
                422: `Malformed appointment_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get an appointment by ID
     * Returns the appointment row. Owner sees their own;
     * other callers must satisfy the calendar's read-authz
     * rules .
     * @returns AppointmentOut OK
     * @throws ApiError
     */
    public static getAppointment({
        appointmentId,
    }: {
        /**
         * Appointment ID (prefixed 'apt_<uuid>' or bare UUID)
         */
        appointmentId: any,
    }): CancelablePromise<AppointmentOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendars/appointments/{appointment_id}',
            path: {
                'appointment_id': appointmentId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not authorized`,
                404: `Appointment not found`,
                422: `Malformed appointment_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update an appointment
     * Partial update. Authz: appointment owner OR admin
     * OR calendar owner (per entity-type).
     * @returns AppointmentOut OK
     * @throws ApiError
     */
    public static updateAppointment({
        appointmentId,
        requestBody,
    }: {
        /**
         * Appointment ID
         */
        appointmentId: any,
        /**
         * Patch fields
         */
        requestBody: AppointmentUpdateIn,
    }): CancelablePromise<AppointmentOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/calendars/appointments/{appointment_id}',
            path: {
                'appointment_id': appointmentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorized`,
                404: `Appointment not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update appointment status
     * Change an appointment's status. Only the calendar
     * owner / admin can update status .
     * @returns AppointmentOut OK
     * @throws ApiError
     */
    public static updateAppointmentStatus({
        appointmentId,
        requestBody,
    }: {
        /**
         * Appointment ID
         */
        appointmentId: any,
        /**
         * Status payload
         */
        requestBody: AppointmentStatusUpdateIn,
    }): CancelablePromise<AppointmentOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/calendars/appointments/{appointment_id}/status',
            path: {
                'appointment_id': appointmentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorized`,
                404: `Appointment not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a calendar
     * Removes the calendar and cascades to its
     * appointments (FK cascade).
     * @returns void
     * @throws ApiError
     */
    public static deleteCalendar({
        calendarId,
    }: {
        /**
         * Calendar ID
         */
        calendarId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/calendars/{calendar_id}',
            path: {
                'calendar_id': calendarId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not authorized`,
                404: `Calendar not found`,
                422: `Malformed calendar_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a calendar with appointments
     * Returns the calendar row + every appointment on it.
     * Private calendars require entity ownership (user
     * type) or admin role .
     * @returns CalendarWithAppointmentsOut OK
     * @throws ApiError
     */
    public static getCalendar({
        calendarId,
    }: {
        /**
         * Calendar ID (prefixed 'cal_<uuid>' or bare UUID)
         */
        calendarId: any,
    }): CancelablePromise<CalendarWithAppointmentsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendars/{calendar_id}',
            path: {
                'calendar_id': calendarId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not authorized`,
                404: `Calendar not found`,
                422: `Malformed calendar_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a calendar
     * Partial update: only provided fields are written.
     * Same authz rules as create.
     * @returns CalendarOut OK
     * @throws ApiError
     */
    public static updateCalendar({
        calendarId,
        requestBody,
    }: {
        /**
         * Calendar ID
         */
        calendarId: any,
        /**
         * Patch fields
         */
        requestBody: CalendarUpdateIn,
    }): CancelablePromise<CalendarOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/calendars/{calendar_id}',
            path: {
                'calendar_id': calendarId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorized`,
                404: `Calendar not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Export calendar as iCalendar (.ics)
     * Returns the calendar's appointments as an RFC 5545
     * iCalendar (text/calendar) document. Anonymous-
     * accepting: public calendars serve to any caller;
     * private calendars BOLA-safe 404 to anyone except
     * the user-owner (v1 owner_type='user' only - non-
     * user owner types of private calendars also 404 in
     * the ICS path so the URL is not an enumeration
     * oracle).
     * @returns string iCalendar VCALENDAR document (text/calendar; charset=utf-8)
     * @throws ApiError
     */
    public static exportCalendarIcs({
        calendarId,
        token,
    }: {
        /**
         * Calendar ID (UUID or cal_<uuid>)
         */
        calendarId: any,
        /**
         * Public access token (advisory; gateway carveout is the actual trust gate)
         */
        token?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendars/{calendar_id}.ics',
            path: {
                'calendar_id': calendarId,
            },
            query: {
                'token': token,
            },
            errors: {
                404: `Calendar not found (or private-non-owner - BOLA-safe)`,
                422: `Malformed calendar_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Compute calendar availability
     * Returns busy intervals, free intervals, and
     * generated slots within [start, end]. Busy intervals
     * are derived from approved appointments (and
     * optionally pending if include_pending=true) plus
     * blocker-typed appointments. Rejected/cancelled
     * appointments are ignored.
     * @returns AvailabilityOut OK
     * @throws ApiError
     */
    public static checkCalendarAvailability({
        calendarId,
        start,
        end,
        slotMinutes,
        includePending,
        timezone,
    }: {
        /**
         * Calendar ID
         */
        calendarId: any,
        /**
         * Range start (RFC3339)
         */
        start: any,
        /**
         * Range end (RFC3339)
         */
        end: any,
        /**
         * Slot size in minutes (default 30, max 1440)
         */
        slotMinutes?: any,
        /**
         * Treat pending appointments as busy
         */
        includePending?: any,
        /**
         * IANA timezone (advisory only)
         */
        timezone?: any,
    }): CancelablePromise<AvailabilityOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendars/{calendar_id}/availability',
            path: {
                'calendar_id': calendarId,
            },
            query: {
                'start': start,
                'end': end,
                'slot_minutes': slotMinutes,
                'include_pending': includePending,
                'timezone': timezone,
            },
            errors: {
                400: `end must be after start`,
                401: `Authentication required`,
                404: `Calendar not found`,
                422: `Malformed query`,
                500: `Internal error`,
            },
        });
    }
}
