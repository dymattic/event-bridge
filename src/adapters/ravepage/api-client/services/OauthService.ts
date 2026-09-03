/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OAuthCompleteSignupIn } from '../models/OAuthCompleteSignupIn';
import type { OAuthCompleteSignupOut } from '../models/OAuthCompleteSignupOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OauthService {
    /**
     * Complete first-time OAuth signup when provider omitted email
     * Under the canonical Zitadel deployment this endpoint is RETIRED: first-time OAuth signup (including the no-email provider case) is owned by Zitadel's hosted login, which collects the email itself. The OAuth callback no longer issues a signup_token, so this endpoint returns 410 Gone with `Location: /auth/config` - bootstrap the OIDC client from there. Anon at the edge - the signed token was the auth.
     * @returns OAuthCompleteSignupOut Legacy path only - pre-cutover
     * @throws ApiError
     */
    public static completeOAuthSignupEmail({
        requestBody,
    }: {
        /**
         * Signup token + email + redirect target
         */
        requestBody: OAuthCompleteSignupIn,
    }): CancelablePromise<OAuthCompleteSignupOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/oauth/signup/complete-email',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body or invalid signup_token`,
                410: `Retired - first-time signup is owned by Zitadel; bootstrap via /auth/config`,
                422: `Invalid email or frontend_redirect_uri`,
                503: `Signup completion unavailable (signing key unconfigured)`,
            },
        });
    }
}
