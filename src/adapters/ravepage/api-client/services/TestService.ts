/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TestSuccessOut } from '../models/TestSuccessOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TestService {
    /**
     * Test successful response
     * Test endpoint that returns a successful response.
     * Used to exercise the gateway's happy-path
     * serialization. Gated behind GATEWAY_EXPOSE_TEST_ERRORS=1;
     * production deploys do not expose it.
     * @returns TestSuccessOut OK
     * @throws ApiError
     */
    public static testErrorsSuccess(): CancelablePromise<TestSuccessOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/test-errors/success',
        });
    }
    /**
     * Test system error handling
     * Test endpoint that returns the generic 500 envelope
     * via the standard handle_error code path. Used to
     * exercise the gateway's caught-exception pipeline.
     * Gated behind GATEWAY_EXPOSE_TEST_ERRORS=1.
     * @returns void
     * @throws ApiError
     */
    public static testSystemError(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/test-errors/system-error',
            errors: {
                500: `Test system error`,
            },
        });
    }
    /**
     * Test unhandled error handling
     * Test endpoint that returns the generic 500 envelope
     * via the unhandled-exception fallback path. Used to
     * exercise the gateway's uncaught-error pipeline.
     * Gated behind GATEWAY_EXPOSE_TEST_ERRORS=1.
     * @returns void
     * @throws ApiError
     */
    public static testErrorsUnhandled(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/test-errors/unhandled-error',
            errors: {
                500: `Test unhandled error`,
            },
        });
    }
    /**
     * Test user error handling
     * Test endpoint that raises a user error. Returns a 400
     * Problem with the canonical user-error envelope.
     * Gated behind GATEWAY_EXPOSE_TEST_ERRORS=1.
     * @returns void
     * @throws ApiError
     */
    public static testUserError(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/test-errors/user-error',
            errors: {
                400: `Test user error`,
            },
        });
    }
}
