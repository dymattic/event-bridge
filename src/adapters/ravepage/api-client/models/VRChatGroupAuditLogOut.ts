/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatGroupAuditLogOut = {
    /**
     * Actor display name.
     */
    actorDisplayName?: string;
    /**
     * Actor user id.
     */
    actorId?: string;
    /**
     * ISO 8601 event timestamp.
     */
    createdAt?: string;
    /**
     * Event-specific data payload (VRChat-opaque).
     */
    data?: Record<string, any>;
    /**
     * Human-readable description.
     */
    description?: string;
    /**
     * Audit event type.
     */
    eventType?: string;
    /**
     * Audit log entry id.
     */
    id?: string;
    /**
     * Target resource/user id.
     */
    targetId?: string;
};

