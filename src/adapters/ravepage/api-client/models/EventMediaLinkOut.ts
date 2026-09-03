/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventMediaLinkID } from './EventMediaLinkID';
import type { MediaUploadID } from './MediaUploadID';
import type { UserID } from './UserID';
export type EventMediaLinkOut = {
    caption?: string;
    created_at?: string;
    created_by_user_id?: UserID;
    event_id?: EventID;
    id?: EventMediaLinkID;
    media_upload_id?: MediaUploadID;
    role?: string;
    sort_order?: number;
};

