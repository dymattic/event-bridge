/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DMDeliveryListOut } from '../models/DMDeliveryListOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SocialPlatformsService {
    /**
     * List my Discord DM deliveries
     * Returns the caller's Discord DM delivery history.
     * @returns DMDeliveryListOut OK
     * @throws ApiError
     */
    public static listDiscordDmDeliveries({
        limit,
    }: {
        /**
         * Page size (1..200)
         */
        limit?: any,
    }): CancelablePromise<DMDeliveryListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discord/dm/deliveries',
            query: {
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
