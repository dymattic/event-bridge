/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BackupCodesOut } from '../models/BackupCodesOut';
import type { MFAEmailChallengeIn } from '../models/MFAEmailChallengeIn';
import type { MFAEmailChallengeSentOut } from '../models/MFAEmailChallengeSentOut';
import type { MFAEmailEnrollIn } from '../models/MFAEmailEnrollIn';
import type { MFAEnableIn } from '../models/MFAEnableIn';
import type { MFAMethodOut } from '../models/MFAMethodOut';
import type { MFASSOEnrollIn } from '../models/MFASSOEnrollIn';
import type { MFAStatusMethodOut } from '../models/MFAStatusMethodOut';
import type { MFAStatusOut } from '../models/MFAStatusOut';
import type { TOTPEnrollOut } from '../models/TOTPEnrollOut';
import type { TOTPVerifyIn } from '../models/TOTPVerifyIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MfaService {
    /**
     * Generate a fresh batch of MFA backup codes
     * Invalidates any prior batch. Plaintext codes are shown
     * ONCE - surface a "save these now" UI step.
     * @returns BackupCodesOut OK
     * @throws ApiError
     */
    public static generateBackupCodes(): CancelablePromise<BackupCodesOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/mfa/backup-codes/generate',
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Dispatch the email OTP for an in-flight MFA challenge
     * Sends a one-time code to the user's verified email for
     * an in-flight MFA challenge id. The caller must own the
     * challenge . Bespoke Rave-native MFA flow
     * scoped to a server-issued challenge id - independent of
     * the Zitadel IdP's own MFA.
     * @returns MFAEmailChallengeSentOut Email dispatched
     * @throws ApiError
     */
    public static sendMfaEmailOtp({
        requestBody,
    }: {
        /**
         * Challenge id
         */
        requestBody: MFAEmailChallengeIn,
    }): CancelablePromise<MFAEmailChallengeSentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/mfa/challenge/email',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid challenge_id`,
                401: `Authentication required`,
                403: `Challenge does not belong to caller`,
                404: `Challenge not found`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Enroll the user's email address as an MFA method
     * Adds the user's verified email as an MFA factor. Label
     * is optional.
     * @returns MFAStatusMethodOut Created
     * @throws ApiError
     */
    public static enrollEmailOtp({
        requestBody,
    }: {
        /**
         * Optional label
         */
        requestBody?: MFAEmailEnrollIn,
    }): CancelablePromise<MFAStatusMethodOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/mfa/email/enroll',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
            },
        });
    }
    /**
     * Enable or disable MFA on the current account
     * Flips the user-level MFA gate. Password may be required
     * by the service when disabling .
     * @returns MFAStatusOut OK
     * @throws ApiError
     */
    public static setMfaEnabled({
        requestBody,
    }: {
        /**
         * Enabled flag + optional password
         */
        requestBody: MFAEnableIn,
    }): CancelablePromise<MFAStatusOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/mfa/enable',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
            },
        });
    }
    /**
     * Remove an enrolled MFA method
     * Removes the method row. Refuses when the method is the
     * user's primary or last remaining factor.
     * @returns void
     * @throws ApiError
     */
    public static deleteMfaMethod({
        methodId,
    }: {
        /**
         * Method id (UUID)
         */
        methodId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/auth/mfa/methods/{method_id}',
            path: {
                'method_id': methodId,
            },
            errors: {
                400: `Invalid method_id`,
                401: `Authentication required`,
                404: `Method not found`,
            },
        });
    }
    /**
     * Enroll an SSO provider as an MFA factor
     * Marks one of the user's existing OAuth links as usable
     * for second-factor verification.
     * @returns MFAStatusMethodOut Created
     * @throws ApiError
     */
    public static enrollSsoMfa({
        requestBody,
    }: {
        /**
         * Provider + optional label
         */
        requestBody: MFASSOEnrollIn,
    }): CancelablePromise<MFAStatusMethodOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/mfa/sso/enroll',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Get the current user's MFA status
     * Returns whether MFA is enabled, the list of enrolled
     * methods, and the count of remaining backup codes.
     * @returns MFAStatusOut OK
     * @throws ApiError
     */
    public static getMfaStatus(): CancelablePromise<MFAStatusOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/mfa/status',
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Start TOTP enrolment
     * Generate a new TOTP secret. The user must verify it via
     * POST /auth/mfa/totp/verify before it becomes active.
     * @returns TOTPEnrollOut OK
     * @throws ApiError
     */
    public static enrollTotp(): CancelablePromise<TOTPEnrollOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/mfa/totp/enroll',
            errors: {
                401: `Authentication required`,
                404: `User not found`,
                409: `MFA already enrolled or enrollment in progress`,
            },
        });
    }
    /**
     * Verify TOTP enrolment
     * Confirm a TOTP enrolment with a 6-digit code from the
     * authenticator app. Response is the verified MFAMethodOut
     * per app/schemas/mfa.py.
     * @returns MFAMethodOut OK
     * @throws ApiError
     */
    public static verifyTotpEnrolment({
        requestBody,
    }: {
        /**
         * TOTP code
         */
        requestBody: TOTPVerifyIn,
    }): CancelablePromise<MFAMethodOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/mfa/totp/verify',
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
}
