/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VRChatPastDisplayName } from './VRChatPastDisplayName';
export type VRChatUserOut = {
    /**
     * Bio.
     */
    bio?: string;
    /**
     * Social links in VRChat bio.
     */
    bioLinks?: Array<string>;
    /**
     * Current avatar id.
     */
    currentAvatar?: string;
    /**
     * Current avatar image URL.
     */
    currentAvatarImageUrl?: string;
    /**
     * Current avatar thumbnail.
     */
    currentAvatarThumbnailImageUrl?: string;
    /**
     * Date joined VRChat.
     */
    dateJoined?: string;
    /**
     * Developer type.
     */
    developerType?: string;
    /**
     * Display name.
     */
    displayName?: string;
    /**
     * Friend key.
     */
    friendKey?: string;
    /**
     * Home world id.
     */
    homeLocation?: string;
    /**
     * VRChat user id.
     */
    id?: string;
    /**
     * Whether this user is a friend.
     */
    isFriend?: boolean;
    /**
     * Last activity timestamp.
     */
    last_activity?: string;
    /**
     * Last login timestamp.
     */
    last_login?: string;
    /**
     * Last platform used.
     */
    last_platform?: string;
    /**
     * Previous display names.
     */
    pastDisplayNames?: Array<VRChatPastDisplayName>;
    /**
     * Current presence (VRChat-opaque blob).
     */
    presence?: Record<string, any>;
    /**
     * Profile picture override URL.
     */
    profilePicOverride?: string;
    /**
     * Profile-pic-override thumbnail.
     */
    profilePicOverrideThumbnail?: string;
    /**
     * Pronouns.
     */
    pronouns?: string;
    /**
     * Online state (online/active/offline).
     */
    state?: string;
    /**
     * User status (VRChat presence).
     */
    status?: 'active' | 'join me' | 'ask me' | 'busy' | 'offline';
    /**
     * Status message.
     */
    statusDescription?: string;
    /**
     * Recent status descriptions.
     */
    statusHistory?: Array<string>;
    /**
     * User tags.
     */
    tags?: Array<string>;
    /**
     * User icon URL.
     */
    userIcon?: string;
    /**
     * Username.
     */
    username?: string;
};

