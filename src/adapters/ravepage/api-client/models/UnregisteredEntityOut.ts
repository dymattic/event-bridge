/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupID } from './GroupID';
import type { UnregisteredEntityID } from './UnregisteredEntityID';
import type { UserID } from './UserID';
export type UnregisteredEntityOut = {
    claimed_at?: string;
    claimed_by_group_id?: GroupID;
    claimed_by_user_id?: UserID;
    created_at?: string;
    entity_type?: string;
    id?: UnregisteredEntityID;
    is_claimed?: boolean;
    name?: string;
};

