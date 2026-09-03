/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventTemplateSlotIn } from './EventTemplateSlotIn';
export type EventTemplateUpdateIn = {
    capacity?: number;
    cover_image_url?: string;
    default_duration_minutes?: number;
    default_organizer_id?: string;
    default_organizer_type?: string;
    description?: string;
    description_event?: string;
    is_public?: boolean;
    location?: string;
    name?: string;
    rrule?: string;
    /**
     * Slots is partial-replace: when non-nil (even empty []), the
     * template's slot scaffolding is replaced atomically with the
     * supplied list. parity at
     */
    slots?: Array<EventTemplateSlotIn>;
    title?: string;
    venue_name?: string;
    visibility?: 'private' | 'shared' | 'public';
};

