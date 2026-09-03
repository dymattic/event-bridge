/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SubscriptionCreateIn = {
    /**
     * Optional channel list
     */
    channels?: Array<string>;
    /**
     * Entity UUID or `prefix_<uuid>`
     */
    entity_id?: string;
    /**
     * Entity scope
     */
    entity_type?: string;
    /**
     * Optional notify-type list
     */
    notify_types?: Array<string>;
};

