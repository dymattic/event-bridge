/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatFriendOut = {
    /**
     * Current avatar image URL.
     */
    currentAvatarImageUrl?: string;
    /**
     * Display name.
     */
    displayName?: string;
    /**
     * VRChat user id.
     */
    id?: string;
    /**
     * Whether this user is a friend.
     */
    isFriend?: boolean;
    /**
     * Profile picture override URL.
     */
    profilePicOverride?: string;
    /**
     * User status.
     */
    status?: 'active' | 'join me' | 'ask me' | 'busy' | 'offline';
    /**
     * Status message.
     */
    statusDescription?: string;
    /**
     * Username.
     */
    username?: string;
};

