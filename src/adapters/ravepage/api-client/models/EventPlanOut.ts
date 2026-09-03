/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventPlanGrantOut } from './EventPlanGrantOut';
import type { EventPlanID } from './EventPlanID';
import type { EventPlanItemOut } from './EventPlanItemOut';
import type { UserID } from './UserID';
export type EventPlanOut = {
    created_at?: string;
    description?: string;
    grants?: Array<EventPlanGrantOut>;
    id?: EventPlanID;
    items?: Array<EventPlanItemOut>;
    /**
     * MyRole is the effective role of the caller - "owner", "editor",
     * "viewer", or nil. Convenience for FE so it can hide edit
     * affordances without re-running the access resolver client-side.
     */
    my_role?: string;
    name?: string;
    owner_user_id?: UserID;
    updated_at?: string;
    visibility?: 'private' | 'shared' | 'public';
};

