/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventTemplateShareEntityIn } from './EventTemplateShareEntityIn';
import type { EventTemplateSlotIn } from './EventTemplateSlotIn';
export type EventTemplateCreateIn = {
    capacity?: number;
    cover_image_url?: string;
    default_duration_minutes?: number;
    /**
     * DefaultOrganizerID accepts BOTH bare UUID and `<prefix>_<uuid>`.
     */
    default_organizer_id?: string;
    default_organizer_type?: string;
    description?: string;
    description_event?: string;
    is_public?: boolean;
    location?: string;
    name?: string;
    rrule?: string;
    shares?: Array<EventTemplateShareEntityIn>;
    slots?: Array<EventTemplateSlotIn>;
    title?: string;
    venue_name?: string;
    /**
     * Visibility is one of {private, shared, public}. Defaults to
     * "private" when unset.
     */
    visibility?: 'private' | 'shared' | 'public';
};

