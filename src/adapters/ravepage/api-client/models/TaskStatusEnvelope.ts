/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskStatusOut } from './TaskStatusOut';
import type { TaskStatusPeriod } from './TaskStatusPeriod';
export type TaskStatusEnvelope = {
    period?: TaskStatusPeriod;
    tasks?: Record<string, TaskStatusOut>;
};

