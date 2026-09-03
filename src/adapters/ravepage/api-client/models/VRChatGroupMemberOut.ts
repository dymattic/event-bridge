/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatGroupMemberOut = {
    /**
     * Current avatar image URL.
     */
    currentAvatarImageUrl?: string;
    /**
     * Member display name.
     */
    displayName?: string;
    /**
     * Group-membership record id.
     */
    id?: string;
    /**
     * Whether the member is representing this group.
     */
    isRepresenting?: boolean;
    /**
     * Date joined the group.
     */
    joinedAt?: string;
    /**
     * Membership status (member/moderator/owner/requested/invited).
     */
    membershipStatus?: string;
    /**
     * Profile picture override URL.
     */
    profilePicOverride?: string;
    /**
     * Group role ids assigned to this member.
     */
    roleIds?: Array<string>;
    /**
     * Member tags.
     */
    tags?: Array<string>;
    /**
     * VRChat user id (use for moderation actions).
     */
    userId?: string;
    /**
     * Member username.
     */
    username?: string;
};

