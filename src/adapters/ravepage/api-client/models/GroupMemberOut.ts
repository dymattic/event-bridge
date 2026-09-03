/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GroupMemberOut = {
    /**
     * AvatarURL - absolute `/media/stream/{upload_id}` URL when set
     * + the identity worker's media-stream base URL is configured.
     * nil otherwise.
     */
    avatar_url?: string;
    /**
     * DisplayName - `users.display_name`; nil when unset (FE falls
     * back to Username).
     */
    display_name?: string;
    /**
     * Role - raw `group_memberships.role` string. NOT lower-cased -
     * preserves stored casing.
     */
    role?: string;
    /**
     * UserID - bare-UUID string (per identity user-lookup wire
     * shape).
     */
    user_id?: string;
    /**
     * Username - raw `users.username`. Empty string ONLY when the
     * identity user-lookup fail-opened on a transient outage; the
     * FE renders as "Unknown user" placeholder.
     */
    username?: string;
};

