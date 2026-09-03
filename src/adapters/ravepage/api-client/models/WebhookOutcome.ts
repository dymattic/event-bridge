/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WebhookOutcome = {
    duplicate?: boolean;
    event_id?: string;
    ok?: boolean;
    /**
     * "ok" | "ignored" | "error" | "duplicate"
     */
    outcome?: string;
};

