/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatInstanceOut = {
    /**
     * Whether instance is active.
     */
    active?: boolean;
    /**
     * Whether age-gated.
     */
    ageGate?: boolean;
    /**
     * Whether invite requests are allowed.
     */
    canRequestInvite?: boolean;
    /**
     * Instance capacity.
     */
    capacity?: number;
    /**
     * Timestamp when instance was closed.
     */
    closedAt?: string;
    /**
     * Instance creator user id.
     */
    creatorId?: string;
    /**
     * Creator display name.
     */
    displayName?: string;
    /**
     * Whether instance is full.
     */
    full?: boolean;
    /**
     * Group access type.
     */
    groupAccessType?: string;
    /**
     * Whether hard-close is enabled.
     */
    hardClose?: boolean;
    /**
     * Whether there is capacity for caller.
     */
    hasCapacityForYou?: boolean;
    /**
     * Full instance id (worldId:instanceId).
     */
    id?: string;
    /**
     * Instance id portion.
     */
    instanceId?: string;
    /**
     * Current user count (alias).
     */
    n_users?: number;
    /**
     * Instance name.
     */
    name?: string;
    /**
     * Owner user/group id.
     */
    ownerId?: string;
    /**
     * Whether instance is permanent.
     */
    permanent?: boolean;
    /**
     * Photon networking region.
     */
    photonRegion?: string;
    /**
     * User counts per platform.
     */
    platforms?: Record<string, any>;
    /**
     * Whether queue is enabled.
     */
    queueEnabled?: boolean;
    /**
     * Queue size.
     */
    queueSize?: number;
    /**
     * Recommended capacity.
     */
    recommendedCapacity?: number;
    /**
     * Instance region (us/eu/jp).
     */
    region?: string;
    /**
     * Whether access is role-restricted.
     */
    roleRestricted?: boolean;
    /**
     * Instance secure name.
     */
    secureName?: string;
    /**
     * Instance short name for sharing.
     */
    shortName?: string;
    /**
     * Whether strict mode.
     */
    strict?: boolean;
    /**
     * Instance tags.
     */
    tags?: Array<string>;
    /**
     * Instance type (public/friends+/friends/invite+/invite/group).
     */
    type?: string;
    /**
     * Current user count.
     */
    userCount?: number;
    /**
     * Users in instance (VRChat-opaque).
     */
    users?: Array<Record<string, any>>;
    /**
     * Embedded world info (VRChat-opaque).
     */
    world?: Record<string, any>;
    /**
     * World id.
     */
    worldId?: string;
};

