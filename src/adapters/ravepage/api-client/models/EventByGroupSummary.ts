/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventByGroupSummary = {
    /**
     * CoverMediaUploadID - events.cover_media_upload_id as bare-UUID.
     * Empty when NULL.
     */
    cover_media_upload_id?: string;
    /**
     * Description - events.description. Empty when NULL.
     */
    description?: string;
    /**
     * EndsAt - events.ends_at as RFC3339 string. Empty when NULL.
     */
    ends_at?: string;
    /**
     * ID - events.id as bare-UUID string.
     */
    id?: string;
    /**
     * IsPublic - events.is_public.
     */
    is_public?: boolean;
    /**
     * OrganizerID - events.organizer_id as bare-UUID string.
     */
    organizer_id?: string;
    /**
     * OrganizerType - events.organizer_type.
     */
    organizer_type?: string;
    /**
     * Slug - events.slug. Empty when NULL.
     */
    slug?: string;
    /**
     * StartsAt - events.starts_at as RFC3339 string. Empty when NULL.
     */
    starts_at?: string;
    /**
     * Status - events.status (lowercased).
     */
    status?: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
    /**
     * Title - events.title.
     */
    title?: string;
    /**
     * Visibility - events.visibility (lowercased). Empty when NULL.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

