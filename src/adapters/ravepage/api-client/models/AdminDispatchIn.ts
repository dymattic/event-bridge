/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminDispatchIn = {
    /**
     * Display body
     */
    body?: string;
    /**
     * Entity UUID
     */
    entity_id?: string;
    /**
     * Entity scope (event, booking, group, ...)
     */
    entity_type?: string;
    /**
     * Per-type metadata bag
     */
    meta?: Record<string, any>;
    /**
     * Type discriminator
     */
    notification_type?: 'booking_request' | 'booking_accepted' | 'booking_declined' | 'event_invitation' | 'event_invitation_accepted' | 'event_invitation_declined' | 'event_started' | 'event_ended' | 'follow' | 'like' | 'comment' | 'mention' | 'system';
    /**
     * Display title
     */
    title?: string;
};

