/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendshipID } from './FriendshipID';
export type FriendshipOut = {
    /**
     * AcceptedAt is when the request was accepted, if applicable
     * (nil pointer for pending / blocked rows).
     */
    accepted_at?: string;
    /**
     * CreatedAt is when the pair row was first created (UTC).
     */
    created_at?: string;
    /**
     * Direction is one of `incoming | outgoing | mutual`. Describes
     * the caller's position relative to the canonical pair:
     * - outgoing → caller is the requester
     * - incoming → caller is the addressee
     * - mutual → accepted (direction is symmetric)
     */
    direction?: 'incoming' | 'outgoing' | 'mutual';
    /**
     * ID is the prefixed friendship-row identifier (`frn_<uuid>`).
     */
    id?: FriendshipID;
    /**
     * OtherUserID is the non-caller side of the pair, rendered from
     * the caller's perspective. Bare UUID on the wire - see
     * Translation notes.
     */
    other_user_id?: string;
    /**
     * Status is one of `pending | accepted | blocked`. The service
     * layer guarantees the value is from the allowed set.
     */
    status?: 'pending' | 'accepted' | 'blocked';
};

