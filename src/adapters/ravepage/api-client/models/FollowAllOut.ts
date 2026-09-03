/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlatformFollowResultOut } from './PlatformFollowResultOut';
export type FollowAllOut = {
    platforms_attempted?: number;
    platforms_failed?: number;
    platforms_skipped?: number;
    platforms_succeeded?: number;
    results?: Array<PlatformFollowResultOut>;
    target_entity_id?: string;
    target_entity_type?: 'user' | 'group';
};

