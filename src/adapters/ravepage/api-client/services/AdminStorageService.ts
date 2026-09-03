/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StorageUsageOut } from '../models/StorageUsageOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminStorageService {
    /**
     * Per-zone S3 usage + DB aggregate + drift
     * Returns the S3-native production+quarantine snapshots
     * alongside the DB SUM(file_size)+COUNT aggregate and
     * the production-vs-DB drift. Admin-only.
     * @returns StorageUsageOut OK
     * @throws ApiError
     */
    public static getAdminStorageUsage({
        refresh,
    }: {
        /**
         * Bypass cache (Go: no-op; every call is live)
         */
        refresh?: any,
    }): CancelablePromise<StorageUsageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/storage/usage',
            query: {
                'refresh': refresh,
            },
            errors: {
                400: `Invalid refresh value`,
                401: `Authentication required`,
                403: `Admin role required`,
                500: `Could not compute storage usage`,
            },
        });
    }
}
