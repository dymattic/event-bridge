/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GroupChatRoomPatchIn = {
    /**
     * IsPublic flips the Matrix room open/invite-only (async).
     * Note: a channel created private stays E2EE even when opened.
     */
    is_public?: boolean;
    name?: string;
    topic?: string;
};

