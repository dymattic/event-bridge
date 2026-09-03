/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RollbackFlags } from './RollbackFlags';
import type { SystemHealthComponents } from './SystemHealthComponents';
export type SystemHealthOut = {
    cached?: boolean;
    checked_at?: string;
    components?: SystemHealthComponents;
    duration_ms?: number;
    overall_status?: string;
    rollback_flags?: RollbackFlags;
};

