/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventCollectionLinkID } from './EventCollectionLinkID';
import type { EventID } from './EventID';
import type { MediaCollectionID } from './MediaCollectionID';
import type { UserID } from './UserID';
export type EventCollectionLinkOut = {
    collection_id?: MediaCollectionID;
    created_at?: string;
    created_by_user_id?: UserID;
    event_id?: EventID;
    id?: EventCollectionLinkID;
    role?: string;
    sort_order?: number;
};

