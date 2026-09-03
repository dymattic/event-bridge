/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppSettingUpdateIn } from '../models/AppSettingUpdateIn';
import type { AppSettingValueOut } from '../models/AppSettingValueOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminSettingsService {
    /**
     * List all app settings
     * Admin-only. Returns the current value (or default) for every known settings key.
     * @returns AppSettingValueOut OK
     * @throws ApiError
     */
    public static listAppSettings(): CancelablePromise<Array<AppSettingValueOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/settings',
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                500: `Settings unavailable`,
            },
        });
    }
    /**
     * Get a single app setting
     * Admin-only. Returns the current value (or default) for one settings key. 404 when the key is not registered.
     * @returns AppSettingValueOut OK
     * @throws ApiError
     */
    public static getAppSetting({
        key,
    }: {
        /**
         * Setting key (e.g. `image_variant_formats`)
         */
        key: any,
    }): CancelablePromise<AppSettingValueOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/settings/{key}',
            path: {
                'key': key,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Unknown setting key`,
                500: `Settings unavailable`,
            },
        });
    }
    /**
     * Update an app setting
     * Admin-only. Writes a new value for one settings key. Rejects values outside the per-key allow-list with 422. 404 when the key is not registered. `updated_by` is stamped from the verified admin claim.
     * @returns AppSettingValueOut OK
     * @throws ApiError
     */
    public static setAppSetting({
        key,
        requestBody,
    }: {
        /**
         * Setting key
         */
        key: any,
        /**
         * New value
         */
        requestBody: AppSettingUpdateIn,
    }): CancelablePromise<AppSettingValueOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/settings/{key}',
            path: {
                'key': key,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Unknown setting key`,
                422: `Value not permitted`,
                500: `Settings unavailable`,
            },
        });
    }
}
