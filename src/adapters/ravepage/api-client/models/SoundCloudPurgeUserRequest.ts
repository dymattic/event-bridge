/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SoundCloudPurgeUserRequest = {
    /**
     * ProviderID - the disconnecting account's SoundCloud numeric user
     * id (decimal string). Required. This is the key SP purges by.
     */
    provider_id?: string;
    /**
     * UserID - the Rave user UUID that unlinked. Optional; carried for
     * logging / observability only (SP purges by ProviderID).
     */
    user_id?: string;
};

