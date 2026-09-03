/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConnectOnboardOut } from '../models/ConnectOnboardOut';
import type { ConnectStatusOut } from '../models/ConnectStatusOut';
import type { PushInvoiceOut } from '../models/PushInvoiceOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BillingPaymentsService {
    /**
     * Start / refresh Stripe Connect Express onboarding
     * Creates (or re-uses) a Stripe Connect Express account for the billing account, then mints a short-lived AccountLink onboarding URL. Idempotent at the row level - second call returns the existing stripe_account_id with a fresh URL. Authz: owner-or-admin on the billing account. BOLA-hardening: not-owner-not-admin → 404. Returns 503 STRIPE_UNAVAILABLE when the Stripe API key is unset on the server.
     * @returns ConnectOnboardOut stripe_account_id + onboarding_url + expires_at
     * @throws ApiError
     */
    public static stripeConnectOnboard({
        accountId,
    }: {
        /**
         * Billing account ID (bare UUID or `ba_<uuid>`)
         */
        accountId: any,
    }): CancelablePromise<ConnectOnboardOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/accounts/{account_id}/connect/onboard',
            path: {
                'account_id': accountId,
            },
            errors: {
                400: `Stripe Connect URLs not configured`,
                401: `Authentication required`,
                404: `Billing account not found`,
                422: `Invalid account id`,
                500: `Internal error`,
                503: `Stripe integration not configured`,
            },
        });
    }
    /**
     * Connect status for a billing account
     * Returns the current Stripe Connect status snapshot - onboarded flag, charges/payouts enabled, requirements summary. Opportunistically refreshes from Stripe on each call (lazy lag-eliminator). Authz: owner-or-admin on the billing account; BOLA-hardening: 404 on not-owner. Returns 503 when the Stripe API key is unset (no live data possible) - same wire shape emits at
     * @returns ConnectStatusOut Snapshot - fields are zero when no onboarding has started
     * @throws ApiError
     */
    public static stripeConnectStatus({
        accountId,
    }: {
        /**
         * Billing account ID (bare UUID or `ba_<uuid>`)
         */
        accountId: any,
    }): CancelablePromise<ConnectStatusOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/accounts/{account_id}/connect/status',
            path: {
                'account_id': accountId,
            },
            errors: {
                401: `Authentication required`,
                404: `Billing account not found`,
                422: `Invalid account id`,
                500: `Internal error`,
                503: `Stripe integration not configured`,
            },
        });
    }
    /**
     * Push an issued invoice to Stripe for payment collection
     * Pushes a finalized invoice (one InvoiceItem per line + an Invoice envelope + Invoice.finalize) to Stripe for payment collection. Idempotent: returns the existing `stripe_invoice_id` when the invoice has already been pushed. Authz: caller must own the invoice's parent billing account; BOLA-hardening: cross-account id-grab → 404 with detail "Invoice not found". Returns 409 when the invoice is not in `issued` status. Returns 503 when the Stripe API key is unset.
     * @returns PushInvoiceOut stripe_invoice_id + invoice_number
     * @throws ApiError
     */
    public static stripePushInvoice({
        invoiceId,
    }: {
        /**
         * Invoice ID (bare UUID or `inv_<uuid>`)
         */
        invoiceId: any,
    }): CancelablePromise<PushInvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/invoices/{invoice_id}/stripe-push',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                401: `Authentication required`,
                404: `Invoice not found`,
                409: `Invoice is not in issued status`,
                422: `Invalid invoice id`,
                500: `Internal error`,
                503: `Stripe integration not configured`,
            },
        });
    }
}
