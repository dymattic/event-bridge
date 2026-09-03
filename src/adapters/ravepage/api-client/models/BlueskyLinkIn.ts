/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BlueskyLinkIn = {
    /**
     * AppPassword is the Bluesky app password. Required, 16..64
     * chars .
     */
    app_password?: string;
    /**
     * Handle is the atproto handle. Required, 3..253 chars .
     */
    handle?: string;
    /**
     * OwnerID is the concrete entity UUID matching OwnerType. Wire
     * accepts bare UUID or the per-owner-type prefix
     * (`usr_/grp_/club_/perf_`).
     */
    owner_id?: string;
    /**
     * OwnerType is one of `user|group|club|performer`.
     */
    owner_type?: string;
};

