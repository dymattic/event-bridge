/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkerSubjectHealth } from './WorkerSubjectHealth';
export type WorkerRoleHealth = {
    role?: string;
    status?: 'ok' | 'degraded' | 'down' | 'unknown' | 'disabled';
    subjects?: Array<WorkerSubjectHealth>;
};

