/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatUserVerificationOut = {
    /**
     * VRChat group id.
     */
    group_id?: string;
    /**
     * Whether the user is a member.
     */
    is_member?: boolean;
    /**
     * User's role in the group.
     */
    role?: string;
    /**
     * VRChat user id being verified.
     */
    target_user_id?: string;
    /**
     * Username of the verified user.
     */
    username?: string;
    /**
     * Verification timestamp.
     */
    verified_at?: string;
    /**
     * Who performed the verification.
     */
    verified_by?: string;
};

