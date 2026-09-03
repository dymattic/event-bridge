/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UnavailablePlatformReason } from './UnavailablePlatformReason';
export type FollowCapabilitiesResult = {
    eligible_platforms?: Array<string>;
    requested_platforms?: Array<string>;
    source_linked_platforms?: Array<string>;
    target_entity_id?: string;
    target_entity_type?: 'user' | 'group' | 'club' | 'performer';
    target_linked_platforms?: Array<string>;
    unavailable_platforms?: Array<UnavailablePlatformReason>;
};

