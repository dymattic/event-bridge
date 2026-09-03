/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OutboxHealth = {
    detail?: string;
    oldest_unpublished_age_seconds?: number;
    status?: 'ok' | 'degraded' | 'down' | 'unknown' | 'disabled';
    unpublished_rows?: number;
};

