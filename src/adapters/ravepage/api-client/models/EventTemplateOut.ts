/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventTemplateID } from './EventTemplateID';
import type { EventTemplateShareOut } from './EventTemplateShareOut';
import type { EventTemplateSlotOut } from './EventTemplateSlotOut';
import type { UserID } from './UserID';
export type EventTemplateOut = {
    capacity?: number;
    cover_image_url?: string;
    created_at?: string;
    default_duration_minutes?: number;
    default_organizer_id?: string;
    default_organizer_type?: string;
    description?: string;
    description_event?: string;
    id?: EventTemplateID;
    is_public?: boolean;
    location?: string;
    name?: string;
    owner_user_id?: UserID;
    rrule?: string;
    shares?: Array<EventTemplateShareOut>;
    slots?: Array<EventTemplateSlotOut>;
    title?: string;
    updated_at?: string;
    venue_name?: string;
    visibility?: 'private' | 'shared' | 'public';
};

