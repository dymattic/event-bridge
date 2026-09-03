/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminEmailTestIn } from '../models/AdminEmailTestIn';
import type { AdminEmailTestOut } from '../models/AdminEmailTestOut';
import type { LegalDocumentOut } from '../models/LegalDocumentOut';
import type { LegalDocumentUpdateIn } from '../models/LegalDocumentUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminToolsService {
    /**
     * Send a test email
     * Returns the
     * typed `{success, to}` envelope. When the upstream
     * contract is not wired (dev / scaffold), returns 503
     * SMTP_NOT_WIRED.
     * @returns AdminEmailTestOut Test email queued/attempted
     * @throws ApiError
     */
    public static sendTestEmail({
        requestBody,
    }: {
        /**
         * Test email body
         */
        requestBody: AdminEmailTestIn,
    }): CancelablePromise<AdminEmailTestOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/email/test',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body / recipient unresolved`,
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid email format`,
                502: `Upstream notifications SMTP relay error`,
                503: `SMTP contract not wired`,
            },
        });
    }
    /**
     * Update the privacy-policy document
     * Admin-only upsert on the `legal_documents` row for the
     * `privacy-policy` slug. Body title + content are both
     * optional; omitted fields preserve the existing values.
     * @returns LegalDocumentOut Post-write document
     * @throws ApiError
     */
    public static updatePrivacyPolicy({
        requestBody,
        adminSecret,
    }: {
        /**
         * Replacement title / content (both optional)
         */
        requestBody: LegalDocumentUpdateIn,
        /**
         * Admin secret override (parsed but ignored)
         */
        adminSecret?: any,
    }): CancelablePromise<LegalDocumentOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/legal/privacy-policy',
            query: {
                'admin_secret': adminSecret,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin role required`,
                503: `Legal-document write not yet available (scaffold mode only)`,
            },
        });
    }
    /**
     * Update the terms-of-service document
     * Admin-only upsert on the `legal_documents` row for the
     * `terms-of-service` slug. Body title + content are both
     * optional; omitted fields preserve the existing values.
     * @returns LegalDocumentOut Post-write document
     * @throws ApiError
     */
    public static updateTermsOfService({
        requestBody,
        adminSecret,
    }: {
        /**
         * Replacement title / content (both optional)
         */
        requestBody: LegalDocumentUpdateIn,
        /**
         * Admin secret override (parsed but ignored)
         */
        adminSecret?: any,
    }): CancelablePromise<LegalDocumentOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/legal/terms-of-service',
            query: {
                'admin_secret': adminSecret,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin role required`,
                503: `Legal-document write not yet available (scaffold mode only)`,
            },
        });
    }
}
