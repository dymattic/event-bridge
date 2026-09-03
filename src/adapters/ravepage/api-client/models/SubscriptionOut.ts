/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SubscriptionOut = {
    /**
     * ISO-8601 timestamp
     */
    created_at?: string;
    /**
     * Delivery channels enabled
     */
    enabled_channels?: Array<string>;
    /**
     * Entity UUID
     */
    entity_id?: string;
    /**
     * Entity scope (event, group, user, ...)
     */
    entity_type?: string;
    /**
     * Subscription UUID
     */
    id?: string;
    /**
     * Notification types subscribed to
     */
    notify_types?: Array<string>;
    /**
     * Owning user UUID
     */
    subscriber_user_id?: string;
    /**
     * ISO-8601 timestamp
     */
    updated_at?: string;
};

