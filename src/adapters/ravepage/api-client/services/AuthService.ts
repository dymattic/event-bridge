/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCreateUserIn } from '../models/AdminCreateUserIn';
import type { AdminCreateUserOut } from '../models/AdminCreateUserOut';
import type { AuthConfigOut } from '../models/AuthConfigOut';
import type { DesktopExchangeIn } from '../models/DesktopExchangeIn';
import type { DesktopExchangeOut } from '../models/DesktopExchangeOut';
import type { DesktopGrantOut } from '../models/DesktopGrantOut';
import type { LoginBeginOut } from '../models/LoginBeginOut';
import type { LoginCallbackIn } from '../models/LoginCallbackIn';
import type { LoginCallbackOut } from '../models/LoginCallbackOut';
import type { LoginFinalizeIn } from '../models/LoginFinalizeIn';
import type { LoginIDPIntentIn } from '../models/LoginIDPIntentIn';
import type { LoginIDPIntentOut } from '../models/LoginIDPIntentOut';
import type { LoginIDPListOut } from '../models/LoginIDPListOut';
import type { LoginIn } from '../models/LoginIn';
import type { LoginPasswordResetConfirmIn } from '../models/LoginPasswordResetConfirmIn';
import type { LoginPasswordResetRequestIn } from '../models/LoginPasswordResetRequestIn';
import type { LoginRefreshIn } from '../models/LoginRefreshIn';
import type { LoginSessionFactorIn } from '../models/LoginSessionFactorIn';
import type { LoginSessionIn } from '../models/LoginSessionIn';
import type { LoginSessionOut } from '../models/LoginSessionOut';
import type { LoginTokensOut } from '../models/LoginTokensOut';
import type { LogoutIn } from '../models/LogoutIn';
import type { MFAChallengeOut } from '../models/MFAChallengeOut';
import type { MFAEnrollBeginOut } from '../models/MFAEnrollBeginOut';
import type { MFAEnrollConfirmIn } from '../models/MFAEnrollConfirmIn';
import type { MFAEnrollConfirmOut } from '../models/MFAEnrollConfirmOut';
import type { MFAVerifyIn } from '../models/MFAVerifyIn';
import type { OAuthFlowIn } from '../models/OAuthFlowIn';
import type { OAuthFlowOut } from '../models/OAuthFlowOut';
import type { OAuthLinkListOut } from '../models/OAuthLinkListOut';
import type { OAuthTokenOut } from '../models/OAuthTokenOut';
import type { RefreshIn } from '../models/RefreshIn';
import type { RefreshOut } from '../models/RefreshOut';
import type { RegisterHumanIn } from '../models/RegisterHumanIn';
import type { RegisterHumanOut } from '../models/RegisterHumanOut';
import type { RegisterVerifyIn } from '../models/RegisterVerifyIn';
import type { RegisterVerifyOut } from '../models/RegisterVerifyOut';
import type { ResendVerificationIn } from '../models/ResendVerificationIn';
import type { UserOAuthLinkCreateIn } from '../models/UserOAuthLinkCreateIn';
import type { UserOAuthLinkOut } from '../models/UserOAuthLinkOut';
import type { UserOut } from '../models/UserOut';
import type { VerifyEmailConfirmIn } from '../models/VerifyEmailConfirmIn';
import type { VerifyEmailIn } from '../models/VerifyEmailIn';
import type { VerifyEmailOut } from '../models/VerifyEmailOut';
import type { VerifyEmailSendOut } from '../models/VerifyEmailSendOut';
import type { VRChatFriendDiscoveryOut } from '../models/VRChatFriendDiscoveryOut';
import type { VRChatFriendsDiscoverIn } from '../models/VRChatFriendsDiscoverIn';
import type { VRChatLinkIn } from '../models/VRChatLinkIn';
import type { VRChatLinkOut } from '../models/VRChatLinkOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Admin-create a user account (out-of-band)
     * Allows ops to mint user accounts without the public
     * /auth/register rate limits. The admin secret is in the
     * body - protect this endpoint with a network-level
     * control. Egress side effect: optional onboarding email
     * via `redirect_url`.
     * @returns AdminCreateUserOut Created
     * @throws ApiError
     */
    public static adminCreateUser({
        requestBody,
    }: {
        /**
         * Admin secret + new user fields
         */
        requestBody: AdminCreateUserIn,
    }): CancelablePromise<AdminCreateUserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/admin/create-user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid email, weak password, or invalid username`,
                401: `Admin secret invalid`,
                409: `Username or email already taken`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Frontend OIDC bootstrap config
     * Returns the coordinates the frontend's OIDC client
     * needs to authenticate against the self-hosted Zitadel
     * IdP: the branch-suffixed `issuer`, the public SPA
     * `client_id`, the `scopes` to request, and the
     * `discovery_url`. The FE runs standard Authorization-
     * Code + PKCE against Zitadel's hosted login - login,
     * MFA, password reset, and email verification all live
     * in Zitadel's UI and are NOT proxied by this API. The
     * FE's OIDC SDK reads the discovery document off the
     * issuer to learn the authorize / token / userinfo /
     * end_session endpoints. Unauthenticated - called before
     * any token exists. Returns 503 when the IdP is not yet
     * configured (deploy still provisioning).
     * @returns AuthConfigOut OK
     * @throws ApiError
     */
    public static getAuthConfig(): CancelablePromise<AuthConfigOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/config',
            errors: {
                503: `Service Unavailable`,
            },
        });
    }
    /**
     * Discord OAuth legacy redirect
     * 302s to the Discord authorization page using a default
     * frontend redirect URI when none is supplied. Anon.
     * @returns void
     * @throws ApiError
     */
    public static discordOauthRedirect({
        frontendRedirectUri,
    }: {
        /**
         * Final FE URL
         */
        frontendRedirectUri?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/discord',
            query: {
                'frontend_redirect_uri': frontendRedirectUri,
            },
            errors: {
                302: `Redirect to Discord auth`,
                503: `Discord client credentials unset`,
            },
        });
    }
    /**
     * Discord OAuth callback
     * Exchanges the authorization code for tokens, upserts
     * the user_oauth_links row, and 303s back to the
     * frontend_redirect_uri with `?linked=true&provider=discord`.
     * @returns void
     * @throws ApiError
     */
    public static discordCallback({
        code,
        state,
    }: {
        /**
         * Authorization code from Discord
         */
        code: any,
        /**
         * Opaque state token from /init
         */
        state: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/discord/callback',
            query: {
                'code': code,
                'state': state,
            },
            errors: {
                303: `Redirect to frontend`,
                400: `Missing or expired state`,
                502: `Token exchange failed`,
                503: `Discord client credentials unset`,
            },
        });
    }
    /**
     * Initialize Discord OAuth flow
     * Generates a Discord authorization URL and persists the
     * flow state. Authed callers may set `link=true` +
     * `user_id` to bind the resulting token to their account.
     * @returns OAuthFlowOut OK
     * @throws ApiError
     */
    public static initDiscordOauth({
        requestBody,
    }: {
        /**
         * Flow init payload
         */
        requestBody: OAuthFlowIn,
    }): CancelablePromise<OAuthFlowOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/discord/init',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required for link=true`,
                403: `Cannot link to a different user_id`,
                422: `Invalid frontend_redirect_uri`,
                503: `Discord client credentials unset`,
            },
        });
    }
    /**
     * Exchange a desktop-grant code for tokens
     * Anonymous-public - body carries the code minted by
     * POST /auth/grant. Returns access + refresh tokens.
     * @returns DesktopExchangeOut OK
     * @throws ApiError
     */
    public static exchangeDesktopGrant({
        requestBody,
    }: {
        /**
         * Grant code
         */
        requestBody: DesktopExchangeIn,
    }): CancelablePromise<DesktopExchangeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/exchange',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid or expired code`,
                500: `Exchange failed`,
                503: `Exchange infrastructure unavailable`,
            },
        });
    }
    /**
     * Google Calendar OAuth legacy redirect
     * 302s to Google's consent screen. Anon.
     * @returns void
     * @throws ApiError
     */
    public static googleCalendarOauthRedirect({
        frontendRedirectUri,
    }: {
        /**
         * Final FE URL
         */
        frontendRedirectUri?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/google-calendar',
            query: {
                'frontend_redirect_uri': frontendRedirectUri,
            },
            errors: {
                302: `Redirect to Google consent`,
                503: `Google client credentials unset`,
            },
        });
    }
    /**
     * Google Calendar OAuth callback
     * Exchanges the code, fetches the linked Google profile,
     * upserts the user_oauth_links row, and 303s to the FE.
     * @returns void
     * @throws ApiError
     */
    public static googleCalendarOauthCallback({
        code,
        state,
    }: {
        /**
         * Authorization code from Google
         */
        code: any,
        /**
         * Opaque state token from /init
         */
        state: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/google-calendar/callback',
            query: {
                'code': code,
                'state': state,
            },
            errors: {
                303: `Redirect to frontend`,
                400: `Missing or expired state`,
                502: `Token exchange failed`,
                503: `Google client credentials unset`,
            },
        });
    }
    /**
     * Initialize Google Calendar OAuth flow
     * Generates a Google authorization URL with the
     * `https://www.googleapis.com/auth/calendar` scope and
     * `access_type=offline` so the callback receives a
     * refresh_token.
     * @returns OAuthFlowOut OK
     * @throws ApiError
     */
    public static initGoogleCalendarOauth({
        requestBody,
    }: {
        /**
         * Flow init payload
         */
        requestBody: OAuthFlowIn,
    }): CancelablePromise<OAuthFlowOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/google-calendar/init',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required for link=true`,
                403: `Cannot link to a different user_id`,
                422: `Invalid frontend_redirect_uri`,
                503: `Google Calendar client credentials unset`,
            },
        });
    }
    /**
     * Mint a desktop-grant exchange code
     * Issues a short-lived one-time code that the desktop app
     * exchanges (via POST /auth/exchange) for an access +
     * refresh token pair. The user is authenticated via their
     * existing JWT to authorize the grant.
     * @returns DesktopGrantOut OK
     * @throws ApiError
     */
    public static createDesktopGrant(): CancelablePromise<DesktopGrantOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/grant',
            errors: {
                401: `Authentication required`,
                500: `Could not mint grant code`,
                503: `Grant infrastructure unavailable`,
            },
        });
    }
    /**
     * Instagram OAuth legacy redirect
     * 302s to the Instagram authorize screen. Anon.
     * @returns void
     * @throws ApiError
     */
    public static instagramOauthRedirect({
        frontendRedirectUri,
    }: {
        /**
         * Final FE URL
         */
        frontendRedirectUri?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/instagram',
            query: {
                'frontend_redirect_uri': frontendRedirectUri,
            },
            errors: {
                302: `Redirect to Instagram authorize`,
                503: `Instagram client credentials unset`,
            },
        });
    }
    /**
     * Instagram OAuth callback
     * Exchanges the code, fetches the IG profile, upserts
     * the user_oauth_links row, and 303s to the FE.
     * @returns void
     * @throws ApiError
     */
    public static instagramOauthCallback({
        code,
        state,
    }: {
        /**
         * Authorization code from Instagram
         */
        code: any,
        /**
         * Opaque state token from /init
         */
        state: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/instagram/callback',
            query: {
                'code': code,
                'state': state,
            },
            errors: {
                303: `Redirect to frontend`,
                400: `Missing or expired state`,
                502: `Token exchange failed`,
                503: `Instagram client credentials unset`,
            },
        });
    }
    /**
     * Initialize Instagram OAuth flow
     * Generates an Instagram authorization URL with the
     * `user_profile,user_media` scopes.
     * @returns OAuthFlowOut OK
     * @throws ApiError
     */
    public static initInstagramOauth({
        requestBody,
    }: {
        /**
         * Flow init payload
         */
        requestBody: OAuthFlowIn,
    }): CancelablePromise<OAuthFlowOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/instagram/init',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required for link=true`,
                403: `Cannot link to a different user_id`,
                422: `Invalid frontend_redirect_uri`,
                503: `Instagram client credentials unset`,
            },
        });
    }
    /**
     * Log in with username + password
     * Returns a JWT access token and a rotating refresh token on
     * success. Rate-limited per-(IP,identifier) and per-account.
     * MFA-enabled accounts receive a partial token + 202
     * MFAChallengeOut - call POST /auth/mfa/verify next.
     * @returns OAuthTokenOut OK
     * @returns MFAChallengeOut MFA required
     * @throws ApiError
     */
    public static loginForAccessToken({
        requestBody,
    }: {
        /**
         * Login credentials
         */
        requestBody: LoginIn,
    }): CancelablePromise<OAuthTokenOut | MFAChallengeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Invalid credentials`,
                403: `Account suspended, banned, deleted, or email-unverified`,
                422: `Validation failed`,
                429: `Rate-limit exceeded`,
                500: `Authentication error`,
            },
        });
    }
    /**
     * Start a login attempt server-side
     * Mints an OIDC auth request WITHOUT sending the browser to
     * the identity provider. The gateway drives the authorize hop
     * itself and keeps the PKCE verifier, so the only thing the
     * caller gets back is the `auth_request_id` to finalize
     * against. Takes no request body.
     *
     * Use it instead of building an authorize URL whenever the
     * browser cannot reach the IdP host - notably from the onion
     * origin, where fetching the discovery document or the token
     * endpoint would be a clearnet connection made at the moment
     * the user authenticates. `GET /auth/config` says which flow
     * applies (`login_flow: "native-bff"`).
     *
     * Then: POST /auth/sessions (+ PATCH for factors) as usual,
     * and POST /auth/login/finalize instead of
     * /auth/sessions/callback. The attempt is single-use and
     * expires after `expires_in` seconds. Rate-limited per-IP.
     * @returns LoginBeginOut OK
     * @throws ApiError
     */
    public static beginNativeLogin(): CancelablePromise<LoginBeginOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/begin',
            errors: {
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `BFF login flow not configured on this deployment`,
            },
        });
    }
    /**
     * Finish a login attempt and receive tokens
     * Completes the auth request from POST /auth/login/begin with
     * an authenticated session and runs the OIDC code exchange
     * server-side, returning the token pair directly. No callback
     * navigation, no browser contact with the identity provider.
     *
     * The tokens are the identity provider's own - identical to
     * what the clearnet redirect flow yields. Renew them with
     * POST /auth/login/refresh.
     *
     * Single-use: the attempt is consumed on the first call, so a
     * replay is 404 whether or not it would otherwise have
     * succeeded. An expired or unknown `auth_request_id` is the
     * same 404 - restart with /auth/login/begin. Rate-limited
     * per-IP.
     * @returns LoginTokensOut OK
     * @throws ApiError
     */
    public static finalizeNativeLogin({
        requestBody,
    }: {
        /**
         * Auth request + authenticated session
         */
        requestBody: LoginFinalizeIn,
    }): CancelablePromise<LoginTokensOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/finalize',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Invalid session credentials`,
                404: `Login attempt unknown, expired or already finalized`,
                422: `Validation failed`,
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `BFF login flow not configured on this deployment`,
            },
        });
    }
    /**
     * Start an external-IDP login
     * Begins a "Sign in with …" external-IDP login. The SPA is
     * anonymous and cannot call Zitadel's idp_intents endpoint
     * (it needs the login-client credential) - the BFF proxies it.
     * Returns the provider `auth_url` to redirect the browser to.
     * On provider success Zitadel redirects to `success_url` with
     * `?id=<idpIntentId>&token=<idpIntentToken>`, which the SPA
     * feeds into POST /auth/sessions to complete login.
     * `success_url`/`failure_url` are restricted server-side to the
     * registered SPA origin (no open-redirect). Rate-limited per-IP.
     * @returns LoginIDPIntentOut OK
     * @throws ApiError
     */
    public static startLoginIdpIntent({
        requestBody,
    }: {
        /**
         * IDP id + redirect URLs
         */
        requestBody: LoginIDPIntentIn,
    }): CancelablePromise<LoginIDPIntentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/idp-intents',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Unknown idp_id`,
                422: `Validation failed`,
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `Native login not configured`,
            },
        });
    }
    /**
     * List active login identity providers
     * Returns the active "Sign in with …" identity providers for
     * the instance login policy. Anonymous - feeds the FE login
     * screen's IDP buttons. Rate-limited per-IP (light).
     * @returns LoginIDPListOut OK
     * @throws ApiError
     */
    public static listLoginIdps(): CancelablePromise<LoginIDPListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/login/idps',
            errors: {
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `Native login not configured`,
            },
        });
    }
    /**
     * Renew tokens obtained through the BFF login flow
     * Runs the OIDC refresh grant server-side. Needed for the same
     * reason /auth/login/finalize is: a caller who cannot reach
     * the identity provider's token endpoint at login cannot reach
     * it an hour later either, and a session that dies at the
     * first access-token expiry is not a session.
     *
     * Distinct from POST /auth/refresh, which rotates the legacy
     * first-party refresh tokens. Use whichever minted the pair
     * you hold. An unknown / revoked / already-rotated token is
     * 404. Rate-limited per-IP.
     * @returns LoginTokensOut OK
     * @throws ApiError
     */
    public static refreshNativeLoginTokens({
        requestBody,
    }: {
        /**
         * Refresh token
         */
        requestBody: LoginRefreshIn,
    }): CancelablePromise<LoginTokensOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                404: `Refresh token unknown, expired or revoked`,
                422: `Validation failed`,
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `BFF login flow not configured on this deployment`,
            },
        });
    }
    /**
     * Log out the current session
     * Adds the access-token jti to the gateway denylist and
     * (when refresh_token is supplied) revokes the refresh
     * token. Idempotent.
     * @returns void
     * @throws ApiError
     */
    public static logoutUser({
        requestBody,
    }: {
        /**
         * Optional refresh-token to revoke
         */
        requestBody?: LogoutIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                503: `Denylist infrastructure unavailable`,
            },
        });
    }
    /**
     * Get current user
     * Identical wire shape to GET /me - emits the canonical
     * UserOut .
     * @returns UserOut OK
     * @throws ApiError
     */
    public static getCurrentUserInfo(): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
            errors: {
                401: `Authentication required`,
                403: `Account banned or suspended`,
                404: `User not found`,
                410: `Account soft-deleted`,
            },
        });
    }
    /**
     * Begin MFA (TOTP) enrollment
     * Generates a fresh TOTP secret + otpauth URI for the
     * current user. The FE renders the URI as a QR; the user
     * scans it and then calls POST /auth/mfa/enroll/confirm
     * with the first 6-digit code.
     * @returns MFAEnrollBeginOut OK
     * @throws ApiError
     */
    public static beginMfaEnroll(): CancelablePromise<MFAEnrollBeginOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/mfa/enroll/begin',
            errors: {
                401: `Authentication required`,
                404: `User not found`,
                409: `MFA already enrolled or enrollment in progress`,
            },
        });
    }
    /**
     * Confirm MFA enrollment with a TOTP code
     * Completes the enrollment started by /auth/mfa/enroll/begin.
     * Returns the recovery codes - shown to the user ONCE.
     * @returns MFAEnrollConfirmOut OK
     * @throws ApiError
     */
    public static confirmMfaEnroll({
        requestBody,
    }: {
        /**
         * TOTP code
         */
        requestBody: MFAEnrollConfirmIn,
    }): CancelablePromise<MFAEnrollConfirmOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/mfa/enroll/confirm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `No pending enrollment or invalid code`,
                401: `Authentication required`,
                410: `Pending enrollment expired`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Verify an MFA challenge and complete login
     * Second step of the MFA login flow. The partial token is
     * the one returned by POST /auth/login with `mfa_required:
     * true`; the code is the TOTP / email / backup code value.
     * @returns OAuthTokenOut OK
     * @throws ApiError
     */
    public static verifyMfa({
        requestBody,
    }: {
        /**
         * MFA challenge
         */
        requestBody: MFAVerifyIn,
    }): CancelablePromise<OAuthTokenOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/mfa/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `MFA verification failed`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * List the current user's OAuth-provider links
     * Returns one row per linked provider (google, discord,
     * twitch, etc.). Tokens are NEVER included - only the
     * public-facing identifier columns.
     * @returns OAuthLinkListOut OK
     * @throws ApiError
     */
    public static listOauthLinks(): CancelablePromise<OAuthLinkListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/oauth/link',
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Link an OAuth account to the current user
     * Associates (provider, provider_id) with the caller's
     * user row. Idempotent on (user, provider). Access/refresh tokens (if supplied) are
     * Vault-encrypted before INSERT and NEVER echoed back.
     * @returns UserOAuthLinkOut Link created or updated
     * @throws ApiError
     */
    public static linkOauthAccount({
        requestBody,
    }: {
        /**
         * OAuth link payload
         */
        requestBody: UserOAuthLinkCreateIn,
    }): CancelablePromise<UserOAuthLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/oauth/link',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                409: `OAuth account already linked to another user`,
                422: `Validation failed - provider+provider_id required`,
            },
        });
    }
    /**
     * Unlink an OAuth provider from the current user
     * Removes the link AND revokes any cached refresh token
     * held in the vault.
     * @returns void
     * @throws ApiError
     */
    public static unlinkOauthAccount({
        provider,
    }: {
        /**
         * Provider slug (google|discord|twitch|...)
         */
        provider: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/auth/oauth/link/{provider}',
            path: {
                'provider': provider,
            },
            errors: {
                400: `Unknown provider`,
                401: `Authentication required`,
                404: `No link to delete`,
            },
        });
    }
    /**
     * Set a new password with a reset code
     * Completes a password reset: sets the new password in Zitadel
     * using the `user_id` + `code` from the emailed link. 204 on
     * success. Rate-limited per-IP.
     * @returns void
     * @throws ApiError
     */
    public static confirmPasswordReset({
        requestBody,
    }: {
        /**
         * user_id + code + new password
         */
        requestBody: LoginPasswordResetConfirmIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/password-reset/confirm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid or expired reset code`,
                422: `Weak password / missing fields`,
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `Password reset not configured`,
            },
        });
    }
    /**
     * Request a password-reset link
     * Emails a password-reset link to the user (via Zitadel). Accepts
     * a username or email in `login_name`. ALWAYS returns the same
     * generic 200 whether or not the account exists - no enumeration
     * oracle. The emailed link lands on the SPA reset page carrying
     * `userID` + `code`, which the SPA posts to
     * /auth/password-reset/confirm. Rate-limited per-IP. Lets users
     * with no password set (IdP-only / migrated) set one instead of
     * being forced onto a social login.
     * @returns string Generic acknowledgement
     * @throws ApiError
     */
    public static requestPasswordReset({
        requestBody,
    }: {
        /**
         * Username or email
         */
        requestBody: LoginPasswordResetRequestIn,
    }): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/password-reset/request',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                429: `Rate-limit exceeded`,
                503: `Password reset not configured`,
            },
        });
    }
    /**
     * Exchange a refresh token for a new access token
     * Rotating refresh-token flow: every successful refresh
     * invalidates the supplied token and returns a NEW refresh
     * token. Reusing a rotated token revokes the entire token
     * family and returns 401 with code
     * `REFRESH_TOKEN_REUSE_DETECTED` - the FE MUST force re-login.
     * @returns RefreshOut OK
     * @throws ApiError
     */
    public static refreshAccessToken({
        requestBody,
    }: {
        /**
         * Refresh token
         */
        requestBody: RefreshIn,
    }): CancelablePromise<RefreshOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Invalid or rotated refresh token`,
                422: `Validation failed`,
                429: `Rate-limit exceeded`,
            },
        });
    }
    /**
     * Register a new account
     * Native branded self-service registration. Creates the user in
     * Zitadel (the identity source of truth) and sends an email
     * verification link. Returns 202 with
     * `status: "verification_pending"` - the caller verifies via the
     * emailed link, then signs in through POST /auth/sessions.
     *
     * Duplicate handling is privacy-preserving: a username (a public
     * handle) that is already taken returns 409; an email that is
     * already registered returns the SAME 202 as a fresh signup and
     * does NOT create a second account (no enumeration oracle - matches
     * the uniform 401 of sign-in). The password is checked against the
     * Zitadel org's complexity policy. Rate-limited per-(IP, username);
     * refused over the onion service by default.
     * @returns RegisterHumanOut Registration accepted; verify email then sign in
     * @throws ApiError
     */
    public static registerUser({
        requestBody,
    }: {
        /**
         * Registration details
         */
        requestBody: RegisterHumanIn,
    }): CancelablePromise<RegisterHumanOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                409: `Username already taken (code CONFLICT)`,
                422: `Invalid email, missing fields, or password fails the complexity policy`,
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `Registration not configured on this deployment`,
            },
        });
    }
    /**
     * Verify registration email
     * Native branded email-verification completion for the Zitadel-
     * backed registration flow. Confirms the `user_id` + `code`
     * pair against Zitadel, then returns `verified: true` so the SPA
     * can route to sign-in.
     *
     * Wrong code, expired code, already-used code, unknown user, and
     * Zitadel failed-precondition responses collapse into the SAME 422
     * INVALID_CODE response (no enumeration oracle).
     * @returns RegisterVerifyOut Email verified
     * @throws ApiError
     */
    public static verifyRegistration({
        requestBody,
    }: {
        /**
         * Verification details
         */
        requestBody: RegisterVerifyIn,
    }): CancelablePromise<RegisterVerifyOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Missing fields, malformed body, or invalid/expired verification code`,
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `Registration verification not configured on this deployment`,
            },
        });
    }
    /**
     * Resend an email-verification link (RETIRED - Zitadel OIDC)
     * Retired. Email verification lives in Zitadel's hosted
     * login. Returns 410 Gone with `Location: /auth/config`;
     * GET /auth/config returns the issuer + client_id to
     * bootstrap the OIDC client. Per AGENTS.md §"No bespoke
     * auth surface in the Go rewrite".
     * @returns void
     * @throws ApiError
     */
    public static resendVerificationEmail({
        requestBody,
    }: {
        /**
         * Email address (ignored - endpoint retired)
         */
        requestBody: ResendVerificationIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/resend-verification',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                410: `Retired - bootstrap via /auth/config`,
            },
        });
    }
    /**
     * Start a native login session
     * Backend-for-frontend over Zitadel's v2 Session API. Supply
     * `login_name` + `password` for username/password login,
     * `idp_intent_id` + `idp_intent_token` to complete an
     * external-IDP login, or `login_name` + `challenge_passkey`
     * to start a passkey (WebAuthn) login. Returns a session id +
     * a session-scoped token (NOT the privileged login-client
     * credential). When a second factor is pending the response
     * carries `challenges` - call PATCH
     * /auth/sessions/{session_id} next. With `challenge_passkey`
     * the response carries `webauthn_challenge` (opaque
     * publicKeyCredentialRequestOptions for
     * navigator.credentials.get()); the WebAuthn RP domain is
     * derived from the request Origin header and must be the SPA
     * host (else 400). `challenge_passkey` is mutually exclusive
     * with password / idp intent (400); an account without a
     * passkey is 409 (code NO_PASSKEY). Rate-limited per-IP.
     * Unknown user and bad password collapse to a single 401 (no
     * enumeration oracle). An invalid/expired idp intent is also
     * 401. A valid intent whose external identity is not linked
     * to any account is first auto-linked from an existing
     * "Linked Accounts" binding (same provider identity) when one
     * exists; otherwise 409 (code IDP_NOT_LINKED).
     * @returns LoginSessionOut OK
     * @throws ApiError
     */
    public static createLoginSession({
        requestBody,
    }: {
        /**
         * Login factors
         */
        requestBody: LoginSessionIn,
    }): CancelablePromise<LoginSessionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/sessions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body, passkey+password/idp combination, or disallowed Origin for a passkey challenge`,
                401: `Invalid credentials or invalid/expired idp intent`,
                409: `IDP identity not linked to any account (code IDP_NOT_LINKED) or no passkey on the account (code NO_PASSKEY)`,
                422: `Validation failed`,
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `Native login not configured`,
            },
        });
    }
    /**
     * Finalize an OIDC auth request with a native session
     * Exchanges an authenticated session (session_id +
     * session_token from POST /auth/sessions) for the OIDC
     * callback URL the SPA redirects to so the existing OIDC code
     * exchange runs. Single-use per auth request. Rate-limited
     * per-IP.
     * @returns LoginCallbackOut OK
     * @throws ApiError
     */
    public static createLoginCallback({
        requestBody,
    }: {
        /**
         * Auth request + session
         */
        requestBody: LoginCallbackIn,
    }): CancelablePromise<LoginCallbackOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/sessions/callback',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                404: `Auth request or session not found / already used`,
                422: `Validation failed`,
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `Native login not configured`,
            },
        });
    }
    /**
     * Add a factor to a native login session
     * credentials.get() completing a passkey
     * challenge). The response carries a FRESH `session_token`
     * (it rotates on every update - finalize with the newest).
     * Rate-limited per-IP.
     * @returns LoginSessionOut OK
     * @throws ApiError
     */
    public static advanceLoginSession({
        sessionId,
        requestBody,
    }: {
        /**
         * Zitadel session id
         */
        sessionId: any,
        /**
         * Next factor
         */
        requestBody: LoginSessionFactorIn,
    }): CancelablePromise<LoginSessionOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/auth/sessions/{session_id}',
            path: {
                'session_id': sessionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Invalid credentials`,
                404: `Session not found`,
                422: `Validation failed`,
                429: `Rate-limit exceeded`,
                502: `Identity provider error`,
                503: `Native login not configured`,
            },
        });
    }
    /**
     * SoundCloud OAuth legacy redirect
     * 302s to the SoundCloud authorize screen. Anon.
     * @returns void
     * @throws ApiError
     */
    public static soundcloudOauthRedirect({
        frontendRedirectUri,
    }: {
        /**
         * Final FE URL
         */
        frontendRedirectUri?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/soundcloud',
            query: {
                'frontend_redirect_uri': frontendRedirectUri,
            },
            errors: {
                302: `Redirect to SoundCloud authorize`,
                503: `SoundCloud client credentials unset`,
            },
        });
    }
    /**
     * SoundCloud OAuth callback
     * Exchanges the code (PKCE), fetches the SC profile,
     * upserts the user_oauth_links row, and 303s to the FE.
     * @returns void
     * @throws ApiError
     */
    public static soundcloudOauthCallback({
        code,
        state,
    }: {
        /**
         * Authorization code from SoundCloud
         */
        code: any,
        /**
         * Opaque state token from /init
         */
        state: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/soundcloud/callback',
            query: {
                'code': code,
                'state': state,
            },
            errors: {
                303: `Redirect to frontend`,
                400: `Missing or expired state`,
                502: `Token exchange failed`,
                503: `SoundCloud client credentials unset`,
            },
        });
    }
    /**
     * Initialize SoundCloud OAuth flow (PKCE)
     * Generates a SoundCloud authorization URL with PKCE
     * and persists the code_verifier + state.
     * @returns OAuthFlowOut OK
     * @throws ApiError
     */
    public static initSoundcloudOauth({
        requestBody,
    }: {
        /**
         * Flow init payload
         */
        requestBody: OAuthFlowIn,
    }): CancelablePromise<OAuthFlowOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/soundcloud/init',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required for link=true`,
                403: `Cannot link to a different user_id`,
                422: `Invalid frontend_redirect_uri`,
                503: `SoundCloud client credentials unset`,
            },
        });
    }
    /**
     * Log in with username + password
     * Identical wire shape to POST /auth/login.
     * @returns OAuthTokenOut OK
     * @returns MFAChallengeOut MFA required
     * @throws ApiError
     */
    public static loginForAccessTokenAlias({
        requestBody,
    }: {
        /**
         * Login credentials
         */
        requestBody: LoginIn,
    }): CancelablePromise<OAuthTokenOut | MFAChallengeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Invalid credentials`,
                403: `Account suspended/banned/email-unverified`,
                422: `Validation failed`,
                429: `Rate-limit exceeded`,
            },
        });
    }
    /**
     * Twitch OAuth callback
     * Exchanges the code (PKCE), fetches the Helix user
     * profile, upserts the user_oauth_links row, and 303s
     * to the FE.
     * @returns void
     * @throws ApiError
     */
    public static twitchOauthCallback({
        code,
        state,
    }: {
        /**
         * Authorization code from Twitch
         */
        code: any,
        /**
         * Opaque state token from /init
         */
        state: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/twitch/callback',
            query: {
                'code': code,
                'state': state,
            },
            errors: {
                303: `Redirect to frontend`,
                400: `Missing or expired state`,
                502: `Token exchange failed`,
                503: `Twitch client credentials unset`,
            },
        });
    }
    /**
     * Initialize Twitch OAuth flow (PKCE)
     * Generates a Twitch authorization URL with PKCE +
     * the chat/broadcast/analytics scopes the API needs.
     * @returns OAuthFlowOut OK
     * @throws ApiError
     */
    public static initTwitchOauth({
        requestBody,
    }: {
        /**
         * Flow init payload
         */
        requestBody: OAuthFlowIn,
    }): CancelablePromise<OAuthFlowOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/twitch/init',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required for link=true`,
                403: `Cannot link to a different user_id`,
                422: `Invalid frontend_redirect_uri`,
                503: `Twitch client credentials unset`,
            },
        });
    }
    /**
     * Verify an email by token or code
     * Anonymous-public. Body carries either the URL token
     * from the email link or the human-readable code. Provide
     * EXACTLY ONE - both or neither → 422.
     * @returns VerifyEmailOut OK
     * @throws ApiError
     */
    public static verifyEmail({
        requestBody,
    }: {
        /**
         * Token or code
         */
        requestBody: VerifyEmailIn,
    }): CancelablePromise<VerifyEmailOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/verify-email',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid or expired token/code`,
                422: `Provide exactly one of token or code`,
            },
        });
    }
    /**
     * Confirm an email-verification token or code
     * Anonymous-public - body carries either the URL token
     * from the email link, or the human-readable code from the
     * email. At least one is required.
     * @returns void
     * @throws ApiError
     */
    public static confirmVerifyEmail({
        requestBody,
    }: {
        /**
         * Token or code
         */
        requestBody: VerifyEmailConfirmIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/verify-email/confirm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid or expired token/code`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Send an email-verification link to the current user
     * Triggers dispatch of an email-verification link/code to
     * the authenticated user's address. The body is empty -
     * the recipient is derived from the JWT claim.
     * @returns VerifyEmailSendOut OK
     * @throws ApiError
     */
    public static sendVerifyEmail(): CancelablePromise<VerifyEmailSendOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/verify-email/send',
            errors: {
                400: `No email on file or already verified`,
                401: `Authentication required`,
                404: `User not found`,
            },
        });
    }
    /**
     * Delete the current user's stored VRChat credentials
     * Removes the VRChat-token row from the vault. Idempotent -
     * 204 even when no row existed.
     * @returns void
     * @throws ApiError
     */
    public static deleteVrchatCredentials(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/auth/vrchat/credentials',
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Discover VRChat friends on rave.page (tokenless, Epic B3)
     * Reverse-lookup: the FE POSTs the caller's VRChat friend
     * ids (gathered client-side by rave-mate); identity bulk-
     * matches them against linked rave users. No user token,
     * no VRChat egress.
     * @returns VRChatFriendDiscoveryOut OK
     * @throws ApiError
     */
    public static discoverVrchatFriendsTokenless({
        requestBody,
    }: {
        /**
         * VRChat friend ids
         */
        requestBody: VRChatFriendsDiscoverIn,
    }): CancelablePromise<VRChatFriendDiscoveryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/vrchat/friends/discover',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Too many ids / invalid body`,
                401: `Authentication required`,
            },
        });
    }
    /**
     * Get VRChat link (tokenless, Epic B3)
     * Returns the caller's tokenless VRChat identity link
     * (provider_id + stored display name). 404 when no link.
     * @returns VRChatLinkOut OK
     * @throws ApiError
     */
    public static getVrchatLink(): CancelablePromise<VRChatLinkOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/vrchat/link',
            errors: {
                401: `Authentication required`,
                404: `No VRChat link`,
            },
        });
    }
    /**
     * Link a VRChat account (tokenless, Epic B3)
     * Records the tokenless VRChat identity link for the
     * current user (provider_id = vrchat_user_id). No auth
     * token is stored - VRChat sessions live in rave-mate.
     * 409 if that VRChat id is already linked to another user.
     * @returns VRChatLinkOut OK
     * @throws ApiError
     */
    public static linkVrchatAccount({
        requestBody,
    }: {
        /**
         * VRChat user id (+ optional display name)
         */
        requestBody: VRChatLinkIn,
    }): CancelablePromise<VRChatLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/vrchat/link',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                409: `VRChat id already linked to another user`,
                422: `vrchat_user_id required`,
            },
        });
    }
    /**
     * RETIRED - VRChat session test moved to rave-mate
     * Returns 410 Gone. VRChat sessions now live in rave-mate.
     * @returns void
     * @throws ApiError
     */
    public static testVrchatConnection(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/vrchat/test',
            errors: {
                410: `Endpoint retired`,
            },
        });
    }
    /**
     * RETIRED - VRChat token storage moved to rave-mate
     * Returns 410 Gone. VRChat sessions now live in rave-mate;
     * use POST /auth/vrchat/link to record the tokenless
     * identity link.
     * @returns void
     * @throws ApiError
     */
    public static storeVrchatToken(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/vrchat/token',
            errors: {
                410: `Endpoint retired`,
            },
        });
    }
    /**
     * X (Twitter) OAuth callback
     * Exchanges the code (PKCE + HTTP Basic for confidential
     * clients), fetches /users/me, upserts the
     * user_oauth_links row, and 303s to the FE.
     * @returns void
     * @throws ApiError
     */
    public static xOauthCallback({
        code,
        state,
    }: {
        /**
         * Authorization code from X
         */
        code: any,
        /**
         * Opaque state token from /init
         */
        state: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/x/callback',
            query: {
                'code': code,
                'state': state,
            },
            errors: {
                303: `Redirect to frontend`,
                400: `Missing or expired state`,
                502: `Token exchange failed`,
                503: `X client credentials unset`,
            },
        });
    }
    /**
     * Initialize X (Twitter) OAuth flow (PKCE)
     * Generates an X v2 authorization URL with PKCE +
     * `tweet.write tweet.read users.read offline.access`.
     * @returns OAuthFlowOut OK
     * @throws ApiError
     */
    public static initXOauth({
        requestBody,
    }: {
        /**
         * Flow init payload
         */
        requestBody: OAuthFlowIn,
    }): CancelablePromise<OAuthFlowOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/x/init',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required for link=true`,
                403: `Cannot link to a different user_id`,
                422: `Invalid frontend_redirect_uri`,
                503: `X client credentials unset`,
            },
        });
    }
    /**
     * YouTube OAuth legacy redirect
     * 302s to Google's consent screen for YouTube scopes. Anon.
     * @returns void
     * @throws ApiError
     */
    public static youtubeOauthRedirect({
        frontendRedirectUri,
    }: {
        /**
         * Final FE URL
         */
        frontendRedirectUri?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/youtube',
            query: {
                'frontend_redirect_uri': frontendRedirectUri,
            },
            errors: {
                302: `Redirect to Google consent`,
                503: `YouTube client credentials unset`,
            },
        });
    }
    /**
     * YouTube OAuth callback
     * Exchanges the code, fetches the Google profile,
     * upserts the user_oauth_links row, and 303s to the FE.
     * @returns void
     * @throws ApiError
     */
    public static youtubeOauthCallback({
        code,
        state,
    }: {
        /**
         * Authorization code from Google
         */
        code: any,
        /**
         * Opaque state token from /init
         */
        state: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/youtube/callback',
            query: {
                'code': code,
                'state': state,
            },
            errors: {
                303: `Redirect to frontend`,
                400: `Missing or expired state`,
                502: `Token exchange failed`,
                503: `YouTube client credentials unset`,
            },
        });
    }
    /**
     * Initialize YouTube OAuth flow
     * Generates a Google authorization URL with the
     * youtube + youtube.force-ssl + youtube.upload scopes
     * and `access_type=offline` so the callback receives a
     * refresh_token.
     * @returns OAuthFlowOut OK
     * @throws ApiError
     */
    public static initYoutubeOauth({
        requestBody,
    }: {
        /**
         * Flow init payload
         */
        requestBody: OAuthFlowIn,
    }): CancelablePromise<OAuthFlowOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/youtube/init',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required for link=true`,
                403: `Cannot link to a different user_id`,
                422: `Invalid frontend_redirect_uri`,
                503: `YouTube client credentials unset`,
            },
        });
    }
}
