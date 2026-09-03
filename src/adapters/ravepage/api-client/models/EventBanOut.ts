/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventBanID } from './EventBanID';
import type { EventID } from './EventID';
import type { GroupID } from './GroupID';
import type { UserID } from './UserID';
export type EventBanOut = {
    banned_by_user_id?: UserID;
    banned_user_id?: UserID;
    created_at?: string;
    event_id?: EventID;
    expires_at?: string;
    id?: EventBanID;
    is_permanent?: boolean;
    organizer_group_id?: GroupID;
    reason?: string;
};

