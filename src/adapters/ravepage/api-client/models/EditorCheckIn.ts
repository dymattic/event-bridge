/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EditorCheckIn = {
    /**
     * EventID - the event whose editor predicate is being resolved.
     * Accepts either bare-UUID or `evt_<uuid>` prefixed form. The
     * events-side handler trims the prefix before parsing.
     */
    event_id?: string;
    /**
     * IsAdmin - the caller's admin flag derived from the gateway-
     * signed claim's roles. Contract callers MUST pass this; the
     * events-side handler trusts it (the gateway is the sole JWT
     * verifier). Avoids a transitive events→identity hop for the
     * common "is the caller admin?" arm.
     */
    is_admin?: boolean;
    /**
     * UserID - the caller whose editor predicate is being evaluated.
     * Accepts either bare-UUID or `usr_<uuid>` prefixed form.
     */
    user_id?: string;
};

