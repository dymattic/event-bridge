/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginSessionIn = {
    /**
     * ChallengePasskey requests a WebAuthn (passkey) challenge alongside
     * the user check: the response carries `webauthn_challenge`, the
     * browser signs it, and the assertion goes to PATCH
     * /auth/sessions/{session_id} as `webauthn_assertion`. The RP domain
     * is derived server-side from the request Origin (must be the SPA
     * host). Mutually exclusive with password / idp_intent_* (400).
     */
    challenge_passkey?: boolean;
    /**
     * IDPIntentID + IDPIntentToken complete an external-IDP login that
     * began at the IDP callback. Mutually exclusive with password.
     */
    idp_intent_id?: string;
    idp_intent_token?: string;
    /**
     * LoginName is the username or email the user typed.
     */
    login_name?: string;
    /**
     * Password is the plaintext password (TLS-protected in transit, never
     * logged). Optional - omit to create a user-only session and supply
     * the password on a follow-up PATCH (rare; FE sends both together).
     */
    password?: string;
};

