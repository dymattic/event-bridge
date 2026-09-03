/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GroupChatRoomOut = {
    /**
     * CreatedAt / UpdatedAt are RFC3339 timestamps.
     */
    created_at?: string;
    /**
     * CreatedBy is the prefixed creator user id.
     */
    created_by?: string;
    /**
     * GroupID is the prefixed owning group id.
     */
    group_id?: string;
    /**
     * ID is the prefixed channel id; resolve the Matrix room via
     * GET /chat/rooms?for=group_channel:<bare-uuid>.
     */
    id?: string;
    /**
     * IsPublic is the REQUESTED visibility (Matrix applies async).
     */
    is_public?: boolean;
    /**
     * Name is the channel display name.
     */
    name?: string;
    /**
     * Topic is the channel topic ("" when unset).
     */
    topic?: string;
    updated_at?: string;
};

