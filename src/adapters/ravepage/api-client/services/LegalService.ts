/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LegalDocumentSimpleOut } from '../models/LegalDocumentSimpleOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LegalService {
    /**
     * Get privacy policy
     * Returns the current privacy-policy document.
     * @returns LegalDocumentSimpleOut OK
     * @throws ApiError
     */
    public static getPrivacyPolicy(): CancelablePromise<LegalDocumentSimpleOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/legal/privacy-policy',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get terms of service
     * Returns the current terms-of-service document.
     * @returns LegalDocumentSimpleOut OK
     * @throws ApiError
     */
    public static getTermsOfService(): CancelablePromise<LegalDocumentSimpleOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/legal/terms-of-service',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
