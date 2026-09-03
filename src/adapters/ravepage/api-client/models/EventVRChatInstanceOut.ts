/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventVRChatInstanceOut = {
    /**
     * Capacity - cached, nullable.
     */
    capacity?: number;
    /**
     * CreatedAt - ISO-8601 UTC.
     */
    created_at?: string;
    /**
     * CreatedByBotID - bot that linked it (bare UUID parity),
     * nullable.
     */
    created_by_bot_id?: string;
    /**
     * CreatedByUserID - user who linked it (typed prefix), nullable.
     */
    created_by_user_id?: string;
    /**
     * EventID - parent event id (typed prefix per project memory).
     */
    event_id?: string;
    /**
     * ID - link record UUID. Bare UUID .
     */
    id?: string;
    /**
     * InstanceID - VRChat instance ID.
     */
    instance_id?: string;
    /**
     * InstanceType - group/friends+/etc., nullable.
     */
    instance_type?: string;
    /**
     * IsFull - at-capacity flag.
     */
    is_full?: boolean;
    /**
     * PlayerCount - cached, nullable.
     */
    player_count?: number;
    /**
     * Region - us/eu/jp, nullable.
     */
    region?: string;
    /**
     * ShortName - launch-URL token, nullable.
     */
    short_name?: string;
    /**
     * Status - active | closed | error.
     */
    status?: 'active' | 'closed' | 'error';
    /**
     * UpdatedAt - ISO-8601 UTC.
     */
    updated_at?: string;
    /**
     * VRChatGroupID - VRChat group id, nullable.
     */
    vrchat_group_id?: string;
    /**
     * WorldID - VRChat world ID.
     */
    world_id?: string;
    /**
     * WorldName - display name, nullable.
     */
    world_name?: string;
};

