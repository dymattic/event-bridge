/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SessionOut = {
    /**
     * AccessToken is the per-device Matrix access token. Bearer it to
     * the homeserver CS API. We do NOT persist it server-side.
     */
    access_token?: string;
    /**
     * CrossSigningPassword is the per-user homeserver password the FE
     * must supply in its bootstrapCrossSigning UIA callback
     * (`m.login.password`) so the device-signing-key upload is
     * authorized. continuwuity gates that upload behind password UIA and
     * appservice/token users have none otherwise. Empty when password
     * provisioning is unconfigured (PASSWORD_PEPPER unset). Derived
     * deterministically server-side from the Vault pepper - never stored.
     * It does NOT unlock E2EE secrets (the recovery key does); it only
     * authorizes the signing-key upload.
     */
    cross_signing_password?: string;
    /**
     * DeviceID is the device this token is bound to (echoed/assigned).
     */
    device_id?: string;
    /**
     * HomeserverBaseURL is the PUBLIC homeserver URL the FE points its
     * Matrix client at (NOT the cluster-internal URL the worker dials).
     */
    homeserver_base_url?: string;
    /**
     * MXID is the user's deterministic Matrix id (@rave_<id>:<server>).
     */
    mxid?: string;
    /**
     * ServerName is the MXID domain (e.g. matrix.dev.rave.page).
     */
    server_name?: string;
};

