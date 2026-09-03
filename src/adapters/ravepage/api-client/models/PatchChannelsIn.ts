/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PatchChannelsIn = {
    /**
     * Per-channel nested config
     */
    channel_configs?: Record<string, Record<string, any>>;
    /**
     * Per-channel enabled flag
     */
    channels?: Record<string, boolean>;
};

