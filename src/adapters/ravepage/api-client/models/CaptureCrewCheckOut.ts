/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CaptureCrewCheckOut = {
    /**
     * Allowed - true when the user is an event editor OR an active
     * crew member.
     */
    allowed?: boolean;
    /**
     * IsEditor - true when the editor arm matched. Load-bearing for
     * the realtime worker's role=master gate (masters must be
     * editors).
     */
    is_editor?: boolean;
    /**
     * Reason - which arm matched. Stable enum for observability +
     * per-caller status-code mapping.
     */
    reason?: 'editor' | 'crew_member' | 'event_not_found' | 'none';
    /**
     * Tier is the roster tier (`panel` | `camera` | `log`) when the
     * crew-member arm matched; "" for editors and denials.
     */
    tier?: '' | 'panel' | 'camera' | 'log';
};

