/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WebhookOutcome } from '../models/WebhookOutcome';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BillingWebhooksService {
    /**
     * Stripe webhook receiver
     * HMAC-SHA256-verified by `Stripe-Signature` header against `stripe_webhook_secret`. Replay window 5 minutes. Events deduped on `stripe_events.event_id` BEFORE any handler runs (duplicates short-circuit). Dispatched handlers: `invoice.paid` / `invoice.payment_succeeded` → mark Invoice paid; `invoice.payment_failed` → log; `account.updated` → sync Connect account flags. Unknown event types are logged and returned ok+ignored. Returns 400 on missing or invalid signature; 500 on handler raise (so Stripe retries); 503 when secret is unset.
     * @returns WebhookOutcome Dispatch outcome
     * @throws ApiError
     */
    public static stripeWebhook({
        stripeSignature,
    }: {
        /**
         * Stripe HMAC signature
         */
        stripeSignature: any,
    }): CancelablePromise<WebhookOutcome> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/webhooks/stripe',
            headers: {
                'Stripe-Signature': stripeSignature,
            },
            errors: {
                400: `Missing or invalid Stripe-Signature header`,
                500: `Webhook handler failed`,
                503: `Stripe integration not configured`,
            },
        });
    }
}
