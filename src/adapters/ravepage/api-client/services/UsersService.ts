/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminUserOut } from '../models/AdminUserOut';
import type { assignBody } from '../models/assignBody';
import type { backgroundResp } from '../models/backgroundResp';
import type { ChangeEmailConfirmIn } from '../models/ChangeEmailConfirmIn';
import type { ChangeEmailIn } from '../models/ChangeEmailIn';
import type { ChangePasswordIn } from '../models/ChangePasswordIn';
import type { DataKeyIn } from '../models/DataKeyIn';
import type { DataKeyListOut } from '../models/DataKeyListOut';
import type { DeleteAccountIn } from '../models/DeleteAccountIn';
import type { PrivacyConsentRead } from '../models/PrivacyConsentRead';
import type { PrivacyConsentUpdate } from '../models/PrivacyConsentUpdate';
import type { PublicUserOut } from '../models/PublicUserOut';
import type { twitchLiveResp } from '../models/twitchLiveResp';
import type { UIPreferencesOut } from '../models/UIPreferencesOut';
import type { UIPreferencesPutIn } from '../models/UIPreferencesPutIn';
import type { UserCreateIn } from '../models/UserCreateIn';
import type { UserOut } from '../models/UserOut';
import type { UserUpdateIn } from '../models/UserUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Soft-delete the current account
     * Requires the current password. Marks the account
     * soft-deleted; subsequent calls return 410 with
     * `ACCOUNT_DELETED`.
     * @returns void
     * @throws ApiError
     */
    public static deleteMe({
        requestBody,
    }: {
        /**
         * Current password
         */
        requestBody: DeleteAccountIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or wrong password`,
                404: `User not found`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Get the current user's profile
     * Returns the authenticated user's identity-owned columns
     * in the canonical UserOut shape . Soft-deleted accounts return
     * 410; banned/suspended return 403 with structured details.
     * @returns UserOut OK
     * @throws ApiError
     */
    public static getMe(): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me',
            errors: {
                401: `Authentication required`,
                403: `Account banned or suspended`,
                404: `User not found`,
                410: `Account soft-deleted`,
            },
        });
    }
    /**
     * Request an email-address change (RETIRED - Zitadel OIDC)
     * Retired. Email-address changes are managed in Zitadel's
     * account UI. Returns 410 Gone with `Location: /auth/config`;
     * GET /auth/config returns the issuer + client_id to
     * bootstrap the OIDC client. Per AGENTS.md §"No bespoke
     * auth surface in the Go rewrite".
     * @returns void
     * @throws ApiError
     */
    public static changeMyEmail({
        requestBody,
    }: {
        /**
         * New email payload (ignored - endpoint retired)
         */
        requestBody: ChangeEmailIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/me/email',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                410: `Retired - bootstrap via /auth/config`,
            },
        });
    }
    /**
     * Confirm an email-address change
     * Anonymous-public - the token is the link the user clicked
     * in the confirmation email.
     * @returns void
     * @throws ApiError
     */
    public static confirmMyEmailChange({
        requestBody,
    }: {
        /**
         * Confirmation token
         */
        requestBody: ChangeEmailConfirmIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/me/email/confirm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid or expired token`,
                409: `Email already registered to another account`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Change the current user's password
     * Requires the current password. New password must satisfy
     * strength rules and differ from the current one.
     * @returns void
     * @throws ApiError
     */
    public static changeMyPassword({
        requestBody,
    }: {
        /**
         * Current + new password
         */
        requestBody: ChangePasswordIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/me/password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Weak password or same as current`,
                401: `Authentication required or wrong current password`,
                404: `User not found`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Get the current user's UI preferences
     * Returns the opaque FE-owned UI-preference document (JSON object) plus the row's last-modified timestamp. Self-only via the verified claim.
     * @returns UIPreferencesOut OK
     * @throws ApiError
     */
    public static getMyUiPreferences(): CancelablePromise<UIPreferencesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/ui-preferences',
            errors: {
                401: `Authentication required`,
                404: `User not found`,
            },
        });
    }
    /**
     * Replace the current user's UI preferences
     * REPLACES the whole stored document (atomic client snapshot semantics - no merge). Body must be a JSON object ≤16KiB serialized. Returns the stored document.
     * @returns UIPreferencesOut OK
     * @throws ApiError
     */
    public static updateMyUiPreferences({
        requestBody,
    }: {
        /**
         * Full preference document
         */
        requestBody: UIPreferencesPutIn,
    }): CancelablePromise<UIPreferencesOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/me/ui-preferences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed request body`,
                401: `Authentication required`,
                404: `User not found`,
                413: `Document exceeds 16KiB`,
                422: `preferences is not a JSON object`,
            },
        });
    }
    /**
     * List all users (admin, legacy /users path)
     * Admin-only paginated directory listing. Same wire shape + same admin gate as
     * `/admin/users`; narrower query surface (skip / limit /
     * sort only - no search / status / is_admin filters).
     * @returns AdminUserOut OK
     * @throws ApiError
     */
    public static listUsers({
        skip,
        limit,
        sort,
    }: {
        /**
         * Pagination skip
         */
        skip?: any,
        /**
         * Pagination limit (1-200)
         */
        limit?: any,
        /**
         * Sort field; prefix - for desc
         */
        sort?: any,
    }): CancelablePromise<Array<AdminUserOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
            query: {
                'skip': skip,
                'limit': limit,
                'sort': sort,
            },
            errors: {
                400: `Invalid query parameter`,
                401: `Authentication required`,
                403: `Admin only`,
            },
        });
    }
    /**
     * Admin: create a user
     * Provisions a new local user row. Validates username +
     * email + password, runs the duplicate pre-check, hashes
     * the password if supplied.
     * @returns UserOut Created
     * @throws ApiError
     */
    public static createUser({
        requestBody,
    }: {
        /**
         * New user payload
         */
        requestBody: UserCreateIn,
    }): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body / weak password / bad email`,
                401: `Authentication required`,
                403: `Admin only`,
                409: `Username or email already registered`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Resolve a username to its public profile
     * Resolves a bare URL-style username (not prefixed) to
     * the redacted PublicUser view. Authed-only - prevents
     * anonymous account enumeration. Same response shape as
     * GET /users/{user_id}.
     * @returns PublicUserOut OK
     * @throws ApiError
     */
    public static getUserByUsername({
        username,
    }: {
        /**
         * Bare username (no prefix)
         */
        username: any,
    }): CancelablePromise<PublicUserOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/by-username/{username}',
            path: {
                'username': username,
            },
            errors: {
                401: `Authentication required`,
                404: `User not found`,
            },
        });
    }
    /**
     * List your wrapped data keys
     * Returns every wrapping of your data key. The client
     * picks the one whose auth factor it can satisfy and
     * unwraps it locally; the server cannot.
     * Used on a new device to recover the key that derives
     * your personal-metrics subject, so history follows you
     * across devices without the server holding the link.
     * @returns DataKeyListOut OK
     * @throws ApiError
     */
    public static listMyDataKeys(): CancelablePromise<DataKeyListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/data-keys',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Store or replace a wrapped data key
     * Stores one wrapping of your data key under one auth
     * factor. Idempotent on (factor, key_ref): a password
     * change re-wraps the SAME key and PUTs it here, which
     * is why the derived personal-metrics subject survives
     * credential changes.
     * Adding a passkey adds another wrapping of the same key
     * with its own key_ref, so several may coexist.
     * @returns void
     * @throws ApiError
     */
    public static putMyDataKey({
        requestBody,
    }: {
        /**
         * Wrapping to store
         */
        requestBody: DataKeyIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/me/data-keys',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body`,
                401: `Authentication required`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove a wrapped data key
     * Removes one wrapping, e.g. when a passkey is revoked.
     * The LAST remaining wrapping cannot be removed: with no
     * wrapping left the key is unrecoverable and the private
     * history derived from it is orphaned permanently. There
     * is deliberately no support-side recovery - an escrowed
     * copy would reintroduce the account-to-subject link the
     * design removes.
     * @returns void
     * @throws ApiError
     */
    public static deleteMyDataKey({
        factor,
        keyRef,
    }: {
        /**
         * Factor
         */
        factor: any,
        /**
         * Which wrapping of that factor (default: the unnamed one)
         */
        keyRef?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/me/data-keys/{factor}',
            path: {
                'factor': factor,
            },
            query: {
                'key_ref': keyRef,
            },
            errors: {
                401: `Authentication required`,
                404: `No such wrapping`,
                409: `Refusing to remove the last wrapping`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get the current user's privacy preferences
     * Returns analytics + personalization opt-in flags. Default
     * is opt-out per project policy (legitimate-interest legal
     * basis with explicit opt-out).
     * @returns PrivacyConsentRead OK
     * @throws ApiError
     */
    public static getMyPrivacyPreferences(): CancelablePromise<PrivacyConsentRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/privacy',
            errors: {
                401: `Authentication required`,
                404: `User not found`,
            },
        });
    }
    /**
     * Update the current user's privacy preferences
     * PATCH-style semantics: omit a field to leave it
     * unchanged. Returns the new full state.
     * @returns PrivacyConsentRead OK
     * @throws ApiError
     */
    public static updateMyPrivacyPreferences({
        requestBody,
    }: {
        /**
         * Privacy preference patch
         */
        requestBody: PrivacyConsentUpdate,
    }): CancelablePromise<PrivacyConsentRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/me/privacy',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `User not found`,
            },
        });
    }
    /**
     * Assign current user's profile background media
     * Assign an image/video upload as profile background.
     * Video backgrounds must be ≤10MB. media_upload_id may
     * be prefixed (upl_<uuid>) or bare UUID.
     * @returns backgroundResp OK
     * @throws ApiError
     */
    public static assignMyProfileBackground({
        requestBody,
    }: {
        /**
         * Upload reference
         */
        requestBody: assignBody,
    }): CancelablePromise<backgroundResp> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/me/profile/background',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body`,
                401: `Authentication required`,
                403: `Upload not owned`,
                404: `Upload not found`,
                422: `Invalid media (mime or size)`,
                502: `Upstream profiles worker unavailable`,
            },
        });
    }
    /**
     * Delete a user
     * Self-or-admin hard-delete. Returns 404 (not 403) for
     * unauthorized callers - BOLA-safe per AGENTS.md. Cross-
     * worker FK cascades execute Postgres-side.
     * @returns void
     * @throws ApiError
     */
    public static deleteUser({
        userId,
    }: {
        /**
         * User UUID or usr_<uuid>
         */
        userId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                400: `Invalid user_id`,
                401: `Authentication required`,
                404: `User not found or not authorized`,
            },
        });
    }
    /**
     * Get a user's public profile
     * Returns the redacted PublicUser view (id, username,
     * display_name, avatar, background) of a user. Sensitive
     * fields like email/is_admin/mfa_enabled/status are
     * intentionally withheld; self-reads use GET /me.
     * @returns PublicUserOut OK
     * @throws ApiError
     */
    public static getUser({
        userId,
    }: {
        /**
         * User id (bare UUID or usr_<uuid>)
         */
        userId: any,
    }): CancelablePromise<PublicUserOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                400: `Invalid user id`,
                401: `Authentication required`,
                404: `User not found`,
            },
        });
    }
    /**
     * Update a user
     * Self-or-admin patch of username / email / password.
     * Returns 404 (not 403) when caller is neither self nor
     * admin - BOLA-safe per AGENTS.md "do not enumerate".
     * Local-row update only. Login credentials (password,
     * email verification, MFA) live in the Zitadel IdP - this
     * endpoint does NOT change them; manage those through
     * Zitadel's account UI.
     * @returns UserOut OK
     * @throws ApiError
     */
    public static updateUser({
        userId,
        requestBody,
    }: {
        /**
         * User UUID or usr_<uuid>
         */
        userId: any,
        /**
         * Fields to update
         */
        requestBody: UserUpdateIn,
    }): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request / bad email`,
                401: `Authentication required`,
                404: `User not found or not authorized`,
                409: `Username or email already taken`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Get user profile background media
     * Retrieve the background media (image or video) for a
     * user. BOLA-gated: caller MUST
     * be self OR admin.
     * @returns backgroundResp OK
     * @throws ApiError
     */
    public static getUserProfileBackground({
        userId,
    }: {
        /**
         * User UUID or usr_<uuid>
         */
        userId: any,
    }): CancelablePromise<backgroundResp> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}/profile/background',
            path: {
                'user_id': userId,
            },
            errors: {
                400: `Invalid user_id`,
                404: `Not found`,
                502: `Upstream profiles worker unavailable`,
            },
        });
    }
    /**
     * Check if a user is live on Twitch
     * Public probe. Resolves the user's linked Twitch broadcaster_id from identity's OAuth-link, asks social-platforms for Helix live-status (app-access-token mint), returns the flat live-status shape. On upstream failure returns 200 is_live=false . Returns 404 when no Twitch link is present.
     * @returns twitchLiveResp OK
     * @throws ApiError
     */
    public static getUserTwitchLiveStatus({
        userId,
    }: {
        /**
         * User UUID or usr_<uuid>
         */
        userId: any,
    }): CancelablePromise<twitchLiveResp> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}/twitch/live',
            path: {
                'user_id': userId,
            },
            errors: {
                400: `Invalid user_id`,
                404: `User has no linked Twitch account`,
            },
        });
    }
}
