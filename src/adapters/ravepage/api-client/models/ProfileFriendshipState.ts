/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileFriendshipState = {
    /**
     * Direction - where the viewer sits in the pair.
     */
    direction?: 'incoming' | 'outgoing' | 'mutual';
    /**
     * ID is the friendship row id (prefix `frn_`).
     */
    id?: string;
    /**
     * Status - current state of the row.
     */
    status?: 'pending' | 'accepted' | 'blocked';
};

