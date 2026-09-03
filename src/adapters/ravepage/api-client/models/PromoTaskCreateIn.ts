/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PromoTaskCreateIn = {
    /**
     * Notes is the optional free-form notes.
     */
    notes?: string;
    /**
     * Platform is the optional platform/channel.
     */
    platform?: 'instagram' | 'tiktok' | 'email' | 'discord' | 'x' | 'bluesky' | 'youtube' | 'soundcloud' | 'other';
    /**
     * ScheduledAt is the optional target execution time.
     */
    scheduled_at?: string;
    /**
     * Status is the initial status.
     * Pointer so the route layer can detect "omitted" vs "explicit
     * pending" if it ever matters.
     */
    status?: 'pending' | 'in_progress' | 'done' | 'cancelled';
    /**
     * Title is the short task title. .., min_length=1,
     * max_length=255)`.
     */
    title?: string;
};

