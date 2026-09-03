/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FollowOut } from './FollowOut';
export type FollowerListOut = {
    /**
     * EntityID is the polymorphic target identifier.
     */
    entity_id?: string;
    /**
     * EntityType is the polymorphic kind tag the listing pertains
     * to.
     */
    entity_type?: string;
    /**
     * Items is the current page of follower rows, newest first.
     * MUST be a JSON array - never `null`. Initialized to an empty
     * slice in the service.
     */
    items?: Array<FollowOut>;
    /**
     * Total is the total number of followers for this entity
     * (across all pages).
     */
    total?: number;
};

