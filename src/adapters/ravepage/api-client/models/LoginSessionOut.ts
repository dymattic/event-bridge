/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginSessionChallengesOut } from './LoginSessionChallengesOut';
export type LoginSessionOut = {
    /**
     * Challenges is non-nil when a further factor is required.
     */
    challenges?: LoginSessionChallengesOut;
    /**
     * SessionID identifies the Zitadel session.
     */
    session_id?: string;
    /**
     * SessionToken authenticates session mutations + the callback exchange.
     * Session-scoped; safe to hand to the SPA. ROTATES on every PATCH -
     * always finalize with the newest.
     */
    session_token?: string;
    /**
     * WebAuthNChallenge is the opaque publicKeyCredentialRequestOptions
     * JSON object, present when challenge_passkey was set. Pass it to
     * navigator.credentials.get() untouched.
     */
    webauthn_challenge?: Record<string, any>;
};

