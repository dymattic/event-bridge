/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilterGroupEntityOut } from './FilterGroupEntityOut';
import type { FilterGroupGrantOut } from './FilterGroupGrantOut';
import type { FilterGroupID } from './FilterGroupID';
import type { FilterGroupSubscriptionOut } from './FilterGroupSubscriptionOut';
import type { UserID } from './UserID';
export type FilterGroupOut = {
    algorithm?: string;
    created_at?: string;
    description?: string;
    entities?: Array<FilterGroupEntityOut>;
    filter_spec?: Record<string, any>;
    grants?: Array<FilterGroupGrantOut>;
    id?: FilterGroupID;
    my_role?: string;
    my_subscription?: FilterGroupSubscriptionOut;
    name?: string;
    owner_user_id?: UserID;
    updated_at?: string;
    visibility?: 'private' | 'shared' | 'public';
};

