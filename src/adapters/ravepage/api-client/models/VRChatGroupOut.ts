/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VRChatGroupGalleryOut } from './VRChatGroupGalleryOut';
export type VRChatGroupOut = {
    /**
     * Group banner file id.
     */
    bannerId?: string;
    /**
     * Group banner URL.
     */
    bannerUrl?: string;
    /**
     * Group creation timestamp.
     */
    createdAt?: string;
    /**
     * Group description.
     */
    description?: string;
    /**
     * Group discriminator (4-digit suffix).
     */
    discriminator?: string;
    /**
     * Group galleries.
     */
    galleries?: Array<VRChatGroupGalleryOut>;
    /**
     * Group icon file id.
     */
    iconId?: string;
    /**
     * Group icon URL.
     */
    iconUrl?: string;
    /**
     * VRChat group id.
     */
    id?: string;
    /**
     * Whether the group is verified.
     */
    isVerified?: boolean;
    /**
     * Group join state (open/closed/invite/request).
     */
    joinState?: string;
    /**
     * Group languages.
     */
    languages?: Array<string>;
    /**
     * Last post creation timestamp.
     */
    lastPostCreatedAt?: string;
    /**
     * Group links.
     */
    links?: Array<string>;
    /**
     * Number of members.
     */
    memberCount?: number;
    /**
     * Caller's membership status.
     */
    membershipStatus?: string;
    /**
     * Caller's membership details (VRChat-opaque blob).
     */
    myMember?: Record<string, any>;
    /**
     * Group name.
     */
    name?: string;
    /**
     * Number of members currently online.
     */
    onlineMemberCount?: number;
    /**
     * Group owner user id.
     */
    ownerId?: string;
    /**
     * Group privacy (default/private).
     */
    privacy?: string;
    /**
     * Group roles (only with includeRoles=true; VRChat-opaque).
     */
    roles?: Array<Record<string, any>>;
    /**
     * Group rules.
     */
    rules?: string;
    /**
     * Group short code.
     */
    shortCode?: string;
    /**
     * Group tags.
     */
    tags?: Array<string>;
    /**
     * Last update timestamp.
     */
    updatedAt?: string;
    /**
     * Group visibility.
     */
    visibility?: 'public' | 'private' | 'hidden';
};

