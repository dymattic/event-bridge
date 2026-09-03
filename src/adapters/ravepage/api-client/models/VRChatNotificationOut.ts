/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatNotificationOut = {
    /**
     * Creation timestamp.
     */
    created_at?: string;
    /**
     * Type-specific payload (VRChat-opaque).
     */
    details?: Record<string, any>;
    /**
     * Notification id.
     */
    id?: string;
    /**
     * Notification message.
     */
    message?: string;
    /**
     * Whether notification has been seen.
     */
    seen?: boolean;
    /**
     * Sender user id.
     */
    senderUserId?: string;
    /**
     * Sender username.
     */
    senderUsername?: string;
    /**
     * Notification type (invite/requestInvite/friendRequest/etc.).
     */
    type?: string;
};

