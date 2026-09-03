/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupID } from './GroupID';
import type { GroupRoleID } from './GroupRoleID';
export type GroupRoleOut = {
    color?: string;
    created_at?: string;
    description?: string;
    group_id?: GroupID;
    id?: GroupRoleID;
    is_self_assignable?: boolean;
    mirrored_from_vrchat?: boolean;
    name?: string;
    permissions?: Array<string>;
    position?: number;
    updated_at?: string;
    vrchat_role_id?: string;
    vrchat_synced_at?: string;
};

