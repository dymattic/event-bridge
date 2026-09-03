/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EditorCheckOut = {
    /**
     * IsEditor - true when ANY of the three arms succeeded. False
     * for `none` and `event_not_found`.
     */
    is_editor?: boolean;
    /**
     * Reason - which arm matched. Stable enum for observability +
     * per-caller status-code mapping.
     */
    reason?: 'admin' | 'event_user' | 'group_organizer' | 'none' | 'event_not_found';
};

