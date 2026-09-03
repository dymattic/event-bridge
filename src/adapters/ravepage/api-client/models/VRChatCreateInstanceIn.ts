/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatCreateInstanceIn = {
    /**
     * Group access type (members/plus/public).
     */
    groupAccessType?: string;
    /**
     * Owner user or group id.
     */
    ownerId?: string;
    /**
     * Enable queue for the instance.
     */
    queueEnabled?: boolean;
    /**
     * Instance region (us/eu/jp).
     */
    region?: string;
    /**
     * Group role ids for group instances.
     */
    roleIds?: Array<string>;
    /**
     * Instance type (public/friends+/friends/invite+/invite/group).
     */
    type?: string;
    /**
     * World id to create the instance in.
     */
    worldId?: string;
};

