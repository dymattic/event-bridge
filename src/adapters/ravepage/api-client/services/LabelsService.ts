/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LabelOut } from '../models/LabelOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LabelsService {
    /**
     * List labels
     * Anonymous-OK list of label entities with optional name filter.
     * @returns LabelOut OK
     * @throws ApiError
     */
    public static listLabels({
        q,
        limit,
    }: {
        /**
         * Case-insensitive name substring
         */
        q?: any,
        /**
         * Max rows (default 200, cap 500)
         */
        limit?: any,
    }): CancelablePromise<Array<LabelOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/labels',
            query: {
                'q': q,
                'limit': limit,
            },
        });
    }
    /**
     * Get label by ID
     * Anonymous-OK single label lookup incl. provider-account links.
     * @returns LabelOut OK
     * @throws ApiError
     */
    public static getLabel({
        labelId,
    }: {
        /**
         * Label ID (UUID)
         */
        labelId: any,
    }): CancelablePromise<LabelOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/labels/{label_id}',
            path: {
                'label_id': labelId,
            },
            errors: {
                404: `Label not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
