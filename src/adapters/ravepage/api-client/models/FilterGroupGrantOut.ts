/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilterGroupGrantID } from './FilterGroupGrantID';
import type { UserID } from './UserID';
export type FilterGroupGrantOut = {
    granted_at?: string;
    granted_by?: UserID;
    id?: FilterGroupGrantID;
    min_group_role?: string;
    principal_id?: string;
    principal_type?: string;
    role?: string;
};

