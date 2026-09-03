/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlatformRefQuery = {
    /**
     * Key is a caller-chosen opaque echo key, unique within the
     * request. Response hits are keyed by it - the caller cannot key by
     * external_ref on the resolve arm, since resolving IS the point.
     */
    key?: string;
    /**
     * PlatformID is the durable platform id (YT videoId / SC numeric
     * track id). Empty when resolving from a cache uuid.
     */
    platform_id?: string;
    /**
     * PlatformUUID is a social-platforms cache-row uuid (legacy arm).
     * Empty when the platform id is already known.
     */
    platform_uuid?: string;
    /**
     * Provider is "youtube" or "soundcloud".
     */
    provider?: string;
};

