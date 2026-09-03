/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventPlanGrantIn } from './EventPlanGrantIn';
import type { EventPlanItemIn } from './EventPlanItemIn';
export type EventPlanCreateIn = {
    description?: string;
    grants?: Array<EventPlanGrantIn>;
    items?: Array<EventPlanItemIn>;
    name?: string;
    /**
     * Visibility is one of {private, shared, public}. Defaults to
     * "private" when unset.
     */
    visibility?: 'private' | 'shared' | 'public';
};

