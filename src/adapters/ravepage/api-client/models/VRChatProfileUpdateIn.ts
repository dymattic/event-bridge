/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatProfileUpdateIn = {
    /**
     * Biography.
     */
    bio?: string;
    /**
     * When true, null/empty values clear the field on VRChat.
     */
    force_update?: boolean;
    /**
     * User status (VRChat presence).
     */
    status?: 'active' | 'join me' | 'ask me' | 'busy' | 'offline';
    /**
     * Status message.
     */
    statusDescription?: string;
};

