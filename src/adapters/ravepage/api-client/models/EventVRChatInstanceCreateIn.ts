/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventVRChatInstanceCreateIn = {
    /**
     * Capacity - instance capacity. Optional, >=0.
     */
    capacity?: number;
    /**
     * InstanceID - VRChat instance ID. Required.
     */
    instance_id?: string;
    /**
     * InstanceType - group/friends+/invite+/etc. Optional, max 50.
     */
    instance_type?: string;
    /**
     * PlayerCount - current player count. Optional, >=0.
     */
    player_count?: number;
    /**
     * Region - us/eu/jp. Optional, max 10.
     */
    region?: string;
    /**
     * ShortName - short name for launch URL. Optional, max 255.
     */
    short_name?: string;
    /**
     * VRChatGroupID - VRChat group that owns the instance. Optional.
     */
    vrchat_group_id?: string;
    /**
     * WorldID - VRChat world ID. Required.
     */
    world_id?: string;
    /**
     * WorldName - World display name. Optional, max 500.
     */
    world_name?: string;
};

