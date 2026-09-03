/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventPlanGrantID } from './EventPlanGrantID';
import type { UserID } from './UserID';
export type EventPlanGrantOut = {
    granted_at?: string;
    granted_by?: UserID;
    id?: EventPlanGrantID;
    min_group_role?: string;
    principal_id?: string;
    principal_type?: string;
    role?: string;
};

