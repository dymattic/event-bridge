/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilterGroupEntityIn } from './FilterGroupEntityIn';
import type { FilterGroupGrantIn } from './FilterGroupGrantIn';
import type { FilterGroupSubscriptionIn } from './FilterGroupSubscriptionIn';
export type FilterGroupCreateIn = {
    algorithm?: string;
    description?: string;
    entities?: Array<FilterGroupEntityIn>;
    filter_spec?: Record<string, any>;
    grants?: Array<FilterGroupGrantIn>;
    name?: string;
    subscription?: FilterGroupSubscriptionIn;
    visibility?: 'private' | 'shared' | 'public';
};

