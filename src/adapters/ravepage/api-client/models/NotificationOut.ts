/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NotificationOut = {
    /**
     * Display body
     */
    body?: string;
    /**
     * ISO-8601 timestamp
     */
    created_at?: string;
    /**
     * Linked entity UUID
     */
    entity_id?: string;
    /**
     * e.g. event / booking / group
     */
    entity_type?: string;
    /**
     * Notification UUID
     */
    id?: string;
    /**
     * Read flag
     */
    is_read?: boolean;
    /**
     * Per-type metadata bag
     */
    meta?: Record<string, any>;
    /**
     * Type discriminator
     */
    notification_type?: 'booking_request' | 'booking_accepted' | 'booking_declined' | 'event_invitation' | 'event_invitation_accepted' | 'event_invitation_declined' | 'event_started' | 'event_ended' | 'follow' | 'like' | 'comment' | 'mention' | 'system';
    /**
     * ISO-8601 timestamp
     */
    read_at?: string;
    /**
     * Display title
     */
    title?: string;
    /**
     * Owning user UUID
     */
    user_id?: string;
};

