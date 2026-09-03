/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { createWebhookBody } from '../models/createWebhookBody';
import type { createWebhookOut } from '../models/createWebhookOut';
import type { webhookSubscriptionDTO } from '../models/webhookSubscriptionDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhooksService {
    /**
     * List webhook subscriptions
     * Returns the caller's own webhook subscriptions. The
     * plaintext secret column is projected to a
     * ``secret_set`` boolean - clients learn whether HMAC
     * signing is configured without re-reading the value.
     * @returns webhookSubscriptionDTO OK
     * @throws ApiError
     */
    public static listWebhookSubscriptions(): CancelablePromise<Array<webhookSubscriptionDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webhooks',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a webhook subscription
     * Register a webhook subscription. The server mints
     * an HMAC secret and returns it ONCE in the response.
     * Subsequent reads of the subscription expose only a
     * boolean indicating whether a secret is set; the
     * plaintext value is never re-exposed. Any client-supplied
     * ``secret`` field on the request body is IGNORED .
     * @returns createWebhookOut Created
     * @throws ApiError
     */
    public static createWebhookSubscription({
        requestBody,
    }: {
        /**
         * URL and topics
         */
        requestBody: createWebhookBody,
    }): CancelablePromise<createWebhookOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a webhook subscription
     * Delete by id. Owner or admin only. Idempotent - 204
     * whether or not the row existed .
     * @returns void
     * @throws ApiError
     */
    public static deleteWebhookSubscription({
        webhookId,
    }: {
        /**
         * Webhook subscription id (UUID or whk_<uuid>)
         */
        webhookId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/webhooks/{webhook_id}',
            path: {
                'webhook_id': webhookId,
            },
            errors: {
                400: `Invalid id`,
                401: `Authentication required`,
                404: `Not found`,
                500: `Internal error`,
            },
        });
    }
}
