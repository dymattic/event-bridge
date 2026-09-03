/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CredsProbeStatus } from './CredsProbeStatus';
import type { CredsProbeUserInfo } from './CredsProbeUserInfo';
export type CredsProbeOut = {
    /**
     * Connected - true iff Status==ok.
     */
    connected?: boolean;
    /**
     * Message - operator-facing diagnostic, safe to log. Identity
     * translates this into the user-facing 200 body's `message`.
     */
    message?: string;
    /**
     * Status - see CredsProbeStatus.
     */
    status?: CredsProbeStatus;
    /**
     * UserInfo - populated only on Status==ok.
     */
    user_info?: CredsProbeUserInfo;
};

