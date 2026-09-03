/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlatformFollowDispatch } from './PlatformFollowDispatch';
export type FollowAllResult = {
    platforms_attempted?: number;
    platforms_failed?: number;
    platforms_skipped?: number;
    platforms_succeeded?: number;
    results?: Array<PlatformFollowDispatch>;
    target_entity_id?: string;
    target_entity_type?: 'user' | 'group' | 'club' | 'performer';
};

