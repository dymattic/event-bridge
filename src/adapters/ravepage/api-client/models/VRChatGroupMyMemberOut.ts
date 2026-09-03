/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatGroupMyMemberOut = {
    /**
     * Ban timestamp if banned.
     */
    bannedAt?: string;
    /**
     * VRChat group id.
     */
    groupId?: string;
    /**
     * Whether 2FA is enabled.
     */
    has2FAEnabled?: boolean;
    /**
     * Whether user is representing this group.
     */
    isRepresenting?: boolean;
    /**
     * ISO 8601 join timestamp.
     */
    joinedAt?: string;
    /**
     * Notes from group managers.
     */
    managerNotes?: string;
    /**
     * Membership status (member/moderator/owner/requested/invited).
     */
    membershipStatus?: string;
    /**
     * Effective permissions for this user.
     */
    permissions?: Array<string>;
    /**
     * Role ids assigned to the user.
     */
    roleIds?: Array<string>;
    /**
     * VRChat user id.
     */
    userId?: string;
    /**
     * Member visibility.
     */
    visibility?: 'visible' | 'hidden' | 'friends';
};

