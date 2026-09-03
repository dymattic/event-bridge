/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GroupChatRoomIn = {
    /**
     * IsPublic - true: open-join + homeserver-directory-listed
     * (room created UNENCRYPTED); false (default): invite-only E2EE.
     */
    is_public?: boolean;
    /**
     * Name is the channel display name. REQUIRED, ≤100 chars, unique
     * per group.
     */
    name?: string;
    /**
     * Topic is the optional channel topic/description.
     */
    topic?: string;
};

