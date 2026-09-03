/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChatLogoutIn = {
    /**
     * AccessToken is the Matrix token to revoke at the homeserver.
     * REQUIRED (we don't store tokens, so the FE supplies the one to
     * kill).
     */
    access_token?: string;
    /**
     * DeviceID is the device row to drop from our bookkeeping. Optional.
     */
    device_id?: string;
};

