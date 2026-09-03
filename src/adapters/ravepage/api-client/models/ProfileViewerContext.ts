/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileFriendshipState } from './ProfileFriendshipState';
export type ProfileViewerContext = {
    /**
     * CanEdit - true when the viewer may modify the profile.
     */
    can_edit?: boolean;
    /**
     * Friendship - caller-perspective friendship state; nil when no
     * row, non-user profile, or owner-initiated block (hidden).
     */
    friendship?: ProfileFriendshipState;
    /**
     * IsFollowing - true if the viewer has a Follow row pointing at
     * this profile's owner.
     */
    is_following?: boolean;
    /**
     * MutualConnections - count of mutual followers.
     */
    mutual_connections?: number;
    /**
     * Relationship - coarse viewer↔owner relationship.
     */
    relationship?: 'owner' | 'member' | 'collaborator' | 'performer' | 'fan' | 'none';
};

