/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilterGroupID } from './FilterGroupID';
import type { FilterGroupSubscriptionID } from './FilterGroupSubscriptionID';
import type { UserID } from './UserID';
export type FilterGroupSubscriptionOut = {
    channels?: Array<string>;
    created_at?: string;
    digest_day_of_week?: number;
    digest_hour_utc?: number;
    filter_group_id?: FilterGroupID;
    id?: FilterGroupSubscriptionID;
    last_digest_sent_at?: string;
    notify_mode?: string;
    updated_at?: string;
    user_id?: UserID;
};

